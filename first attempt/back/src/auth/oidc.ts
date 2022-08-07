import { config } from "../config";
import { BaseClient, generators, Issuer } from "openid-client";
import type { Session, SessionData } from "express-session";
import { App } from "../app";

let issuer: Issuer<BaseClient>;
let client: BaseClient;

export async function setup(app: App) {
    issuer = await Issuer.discover(`https://login.microsoftonline.com/${config.tenant_id}/v2.0`);
    // console.log("discovered", issuer.issuer, issuer.metadata);

    client = new issuer.Client({
        client_id: config.client_id!,
        redirect_uris: ["https://localhost/cb"],
        response_types:["id_token"],
    });

    app.express.post("/cb", async (req, res) => {
        try {
            if (req.session.nonce === undefined) return;
            const params = client.callbackParams(req);
            const tokenSet = await client.callback("https://localhost/cb", params, { nonce: req.session.nonce });
            console.log("received and validated tokens", tokenSet);
            console.log("validated ID token claims", tokenSet.claims());
            delete req.session.nonce;
            req.session.authenticated = true;
            res.redirect("beans");
            return;
        } catch (e) {
            console.error(e);
        }
        res.sendStatus(500);
    });
}

export function getLoginUrl(session: Session & Partial<SessionData>) {
    const nonce = generators.nonce();
    session.nonce = nonce;
    console.log("generating auth url with nonce", nonce);
    return client.authorizationUrl({
        scope: "openid email profile",
        response_mode: "form_post",
        nonce,
    })
}