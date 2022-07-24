import { BaseClient, generators, Issuer } from "openid-client";
import type { Express } from "express";
import { config } from "../config";
let issuer: Issuer<BaseClient>;
let client: BaseClient;

const nonce = generators.nonce();


export async function setup(app: Express) {
    issuer = await Issuer.discover(`https://login.microsoftonline.com/${config.tenant_id}/v2.0`);
    // console.log("discovered", issuer.issuer, issuer.metadata);

    client = new issuer.Client({
        client_id: config.client_id!,
        redirect_uris: ["https://localhost/cb"],
        response_types:["id_token"],
    });

    
    app.post("/cb", async (req, res) => {
        try {
            const params = client.callbackParams(req);
            console.log(params);
            const tokenSet = await client.callback("https://localhost/cb", params, { nonce });
            console.log("received and validated tokens", tokenSet);
            console.log("validated ID token claims", tokenSet.claims());
            res.send("haha");
        } catch (e) {
            console.error(e);
        }
    });
}

export function getLoginUrl() {
    console.log("generating auth url with nonce", nonce);
    return client.authorizationUrl({
        scope: "openid email profile",
        response_mode: "form_post",
        nonce,
    })
}

export async function main() {
}