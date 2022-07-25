import { App } from "../app";
import { getLoginUrl } from "../auth/oidc";

export default function(app: App) {
    app.express.get("/beans", (req, res) => {
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
}