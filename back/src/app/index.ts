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
import { Auth } from "../auth";
import cors from "cors";
import { createLogger } from "bunyan";

declare module 'express-session' {
    interface SessionData {
        nonce: string;
		authenticated: boolean;
    }
}

const logger = createLogger({ name: "app", level: config.log_level });

export class App {
	public express: express.Express;
	public store: Store;
	public auth: Auth;
	private httpsServer: https.Server;
	private httpServer: http.Server;

	constructor(store: Store, auth: Auth) {
		this.store = store;
		this.auth = auth;
		this.auth.setApp(this);
		this.express = express();
		this.httpsServer = https.createServer(
			{
				key: fs.readFileSync("resources/cert.key"),
				cert: fs.readFileSync("resources/cert.pem"),
			},
			this.express,
		);
		this.httpServer = http.createServer(this.express);
		// this.httpServer = http.createServer(function (req, res) {
		// 	res.writeHead(301, { Location: "https://" + req.headers.host + req.url });
		// 	res.end();
		// });
	}

	async setup() {
		logger.info("setup begin");
		this.express.use(express.json());
		this.express.use(express.urlencoded({ extended: true }));
		this.express.use(cors());
		this.express.use(helmet({
			crossOriginEmbedderPolicy: false
		}));
		// this.express.use(passport.initialize());
		// this.express.use(passport.session());
		this.express.use(morgan("combined"));
		this.express.use(session({
			secret: config.session_secret,
			resave: false,
			saveUninitialized: true,
		}))
		
		const routes = await Promise.all([
			//todo: auto-discover or warnings
			(await import("../routes/index")).default,
			(await import("../routes/insert")).process,
			(await import("../routes/beans")).default,
			(await import("../routes/things/list")).default,
			(await import("../routes/relationships")).default,
			(await import("../routes/users/create")).default,
			(await import("../routes/users/list")).default,
		]);
		for (const route of routes) {
			route(this);
		}
		logger.info("setup end");
	}

	async run(httpPort: number, httpsPort: number) {
		logger.info("starting servers");
		this.httpsServer.listen(httpsPort, () => {
			logger.info(`Listening on https://localhost:${httpPort}`);
		});
		this.httpServer.listen(httpPort, () => {
			logger.info(`Listening on http://localhost:${httpsPort}`);
		})
	}
}
