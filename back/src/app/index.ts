import express from "express";
import cors from "cors";
import morgan from "morgan";
import { RelationshipQuery, Store, ThingQuery } from "../data/store";
import { getLoginUrl, main, setup as setupAuth  } from "../auth/issuing";
import fs from "fs";
import https from "https";
import http from "http";

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
		this.app.use(express.urlencoded());
		this.app.use(cors());
		this.app.use(morgan("combined"));
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
			res.send(`
			<a href="${getLoginUrl()}">beans</a>
			`);
			// res.send("asd");
		});
		setupAuth(this.app);

		this.httpsServer = https.createServer(
			{
				key: fs.readFileSync("static/cert.key"),
				cert: fs.readFileSync("static/cert.pem"),
			},
			this.app,
		);
		this.httpServer = http.createServer(function (req, res) {
			res.writeHead(301, { Location: "https://" + req.headers.host + req.url });
			res.end();
		});
	}

	run(httpPort: number, httpsPort: number) {
		this.httpsServer.listen(httpsPort, () => {
			console.log(`Listening on http://localhost:${httpPort}`);
		});
		this.httpServer.listen(httpPort, () => {
			console.log(`Listening on http://localhost:${httpsPort}`);
		})
	}
}
