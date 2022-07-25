import { App } from "../../app";

export default function (app: App) {
	app.express.post("/users/create", async (req, res) => {
		if (req.body.slug === undefined) return res.sendStatus(400);
		if (req.body.password === undefined) return res.sendStatus(400);
		try {
			await app.auth.createUser(req.body.slug, req.body.password);
		} catch (e) {
			return res.sendStatus(400);
		}
		res.sendStatus(200);
	});
}
