import express from "express";
import cors from "cors";
import morgan from "morgan";
import { RelationshipQuery, Store, ThingQuery } from "../data/store";
import { getLoginUrl, main, setup as setupAuth  } from "../auth/issuing";
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
	private store: Store;
	private app: express.Express;
	private httpsServer: https.Server;
	private httpServer: http.Server;
	// private server:

	constructor(store: Store) {
		this.store = store;
		
		this.app = express();
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
		// this.app.use(helmet());
		// this.app.use(passport.initialize());
		// this.app.use(passport.session());
		this.app.use(morgan("combined"));
		this.app.use(session({
			secret: config.session_secret,
			resave: false,
			saveUninitialized: true,
		}))
		this.app.get("/", (req, res) => {
			res.send("Howdy!");
		});
		this.app.post("/things", (req, res) => {
			res.json(this.store.getThings(req.body as ThingQuery));
		});
		this.app.post("/rels", (req, res) => {
			res.json(this.store.getRelationships(req.body as RelationshipQuery));
		});
		this.app.get("/beans", (req, res) => {
			main();
			// res.sendStatus(200);
			let content = `
			<a href="${getLoginUrl(req.session)}">beans</a>
			`;
			if (req.session.authenticated){
				content += `
				<br/>
				<span>you are authenticated</span>
				`;
			}
			res.send(content);
			// res.send("asd");
		});

		this.httpsServer = https.createServer(
			{
				key: fs.readFileSync("resources/cert.key"),
				cert: fs.readFileSync("resources/cert.pem"),
			},
			this.app,
		);
		this.httpServer = http.createServer(function (req, res) {
			res.writeHead(301, { Location: "https://" + req.headers.host + req.url });
			res.end();
		});
	}

	async run(httpPort: number, httpsPort: number) {
		await setupAuth(this.app);
		this.httpsServer.listen(httpsPort, () => {
			console.log(`Listening on https://localhost:${httpPort}`);
		});
		this.httpServer.listen(httpPort, () => {
			console.log(`Listening on http://localhost:${httpsPort}`);
		})
	}
}
