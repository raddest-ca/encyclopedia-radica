import express from "express";
import morgan from "morgan";
import { Store } from "../data/store";
import fs from "fs";
import https from "https";
import http from "http";
import session from "express-session";
import { config } from "../config";
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

export class App {
	public express: express.Express;
	public store: Store;
	public auth: Auth;
	private httpsServer: https.Server;
	private httpServer: http.Server;
	private logger;


	constructor(store: Store, auth: Auth) {
		this.logger = createLogger({ name: "app", level: config.log_level });;
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
		this.logger.debug("setup begin");
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
			(await import("../routes/things")).default,
			(await import("../routes/countThings")).default,
			(await import("../routes/relationships")).default,
			(await import("../routes/countRelationships")).default,
			(await import("../routes/all")).default,
		]);
		for (const route of routes) {
			route(this);
		}
		this.logger.debug("setup end");
	}

	async run(httpPort: number, httpsPort: number) {
		this.logger.debug("starting servers");
		this.httpsServer.listen(httpsPort, () => {
			this.logger.info(`Listening on https://localhost:${httpPort}`);
		});
		this.httpServer.listen(httpPort, () => {
			this.logger.info(`Listening on http://localhost:${httpsPort}`);
		})
	}
}
