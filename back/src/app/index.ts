import express from "express";
import morgan from "morgan";
import { Store, ThingQuery } from "../data/store";
import fs from "fs";
import https from "https";
import http from "http";
import session from "express-session";
import { config } from "../config";
import passport from "passport";
import helmet from "helmet";

declare module 'express-session' {
    interface SessionData {
        nonce: string;
		authenticated: boolean;
    }
}

export class App {
	public express: express.Express;
	public store: Store;
	private httpsServer: https.Server;
	private httpServer: http.Server;

	constructor(store: Store) {
		this.store = store;
		this.express = express();
		this.httpsServer = https.createServer(
			{
				key: fs.readFileSync("resources/cert.key"),
				cert: fs.readFileSync("resources/cert.pem"),
			},
			this.express,
		);
		this.httpServer = http.createServer(function (req, res) {
			res.writeHead(301, { Location: "https://" + req.headers.host + req.url });
			res.end();
		});
	}

	async setup() {
		this.express.use(express.json());
		this.express.use(express.urlencoded({ extended: true }));
		this.express.use(helmet());
		// this.express.use(passport.initialize());
		// this.express.use(passport.session());
		this.express.use(morgan("combined"));
		this.express.use(session({
			secret: config.session_secret,
			resave: false,
			saveUninitialized: true,
		}))
		
		const routes = await Promise.all([
			import("../routes/index"),
			import("../routes/beans"),
			import("../routes/things"),
			import("../routes/relationships")
		]);
		for (const route of routes) {
			route.default(this);
		}
	}

	async run(httpPort: number, httpsPort: number) {
		this.httpsServer.listen(httpsPort, () => {
			console.log(`Listening on https://localhost:${httpPort}`);
		});
		this.httpServer.listen(httpPort, () => {
			console.log(`Listening on http://localhost:${httpsPort}`);
		})
	}
}
