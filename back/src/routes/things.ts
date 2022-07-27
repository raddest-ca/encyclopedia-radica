import { App } from "../app";
import { ThingQuery } from "../data/store";
import { Thing } from "../common/core";

export default function(app: App) {
    app.express.post("/things", async (req, res) => {
        const query = req.body as ThingQuery<any>;
		const results = await app.store.getThings(query);
		res.json(results);
    });
}