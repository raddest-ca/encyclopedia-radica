import { App } from "../app";
import { ThingQuery } from "../data/store";
import { Thing } from "../common/core";

export default function(app: App) {
    app.express.get("/all", async (req, res) => {
		res.json(app.store);
    });
}