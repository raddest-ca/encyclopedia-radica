import express from "express";
import cors from "cors";
import morgan from "morgan";
import { RelationshipQuery, Store, ThingQuery } from "../data/store";

export class App {
	private store: Store;
	private express: express.Express;

	constructor(store: Store) {
		this.store = store;

		this.express = express();
		this.express.use(express.json());
		this.express.use(cors());
		this.express.use(morgan("combined"));
		this.express.get("/", (req, res) => {
			res.send("Howdy!");
		});
		this.express.post("/things", (req, res) => {
			res.json(this.store.getThings(req.body as ThingQuery));
		});
		this.express.post("/rels", (req, res) => {
			res.json(this.store.getRelationships(req.body as RelationshipQuery));
		});
	}

	run(port: number) {
		this.express.listen(port, () => {
			console.log(`Listening on http://localhost:${port}`);
		});
	}
}
