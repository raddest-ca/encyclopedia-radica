import { App } from "../app";

export default function(app: App) {
    app.express.get("/", (req, res) => {
        res.send("Howdy!");
    });
}