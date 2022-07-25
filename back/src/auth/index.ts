import { App } from "../app";
import { knownTypes } from "../models/known-types";

export class Auth {
    public app: App;

    constructor(app: App) {
        this.app = app;
    }

    async getUsers() {
        return await this.app.store.getThings({
            filter: {
                type: "user"
            }
        })
    }
}