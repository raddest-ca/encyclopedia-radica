import { App } from "../../app";

export default function(app: App) {
    app.express.get("/users/list", async (req, res) => {
        const x = await app.auth.getUsers();
        res.json(x);
    });
}