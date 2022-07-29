import { App } from "../app";
import { InsertPayload } from "../common/inserting";
import { process as processPolicy } from "../policy/insert-policy";

export function process(app: App) {
	app.express.post("/insert", async (req, res) => {
		const payload = req.body as InsertPayload;
		try {
			const policyResult = await processPolicy(app, payload);
			if (policyResult.success) {
				app.store.addAll(...policyResult.value.things);
				app.store.addAll(...policyResult.value.relationships);
				res.json(policyResult);
			} else {
				res.status(400);
				res.json(policyResult);
			}
		} catch (e) {
			res.sendStatus(500);
		}
	});
}
