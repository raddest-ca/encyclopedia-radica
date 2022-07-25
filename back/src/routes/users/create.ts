import { App } from "../../app";

export default function (app: App) {
	app.express.post("/users/create", async (req, res) => {
		if (req.body.slug === undefined) return res.sendStatus(400);
		if (req.body.password === undefined) return res.sendStatus(400);
		await app.auth.createUser(req.body.slug, req.body.password);
		res.sendStatus(200);
	});
}
