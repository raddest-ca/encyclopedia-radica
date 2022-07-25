import bcrypt from "bcrypt";
import { v4 } from "uuid";
import { App } from "../app";
import { rel, thing } from "../models/helpers";

export class Auth {
    public app: App;

    constructor() {
        this.app = null as any;
    }

    public setApp(app: App) {
        this.app = app;
    }

    public async getUsers() {
        const rtn = await this.app.store.getThings({
            filter: {
                type: "user"
            }
        });
        return rtn.values;
    }

    public async userExists(id: string) {
        const rtn = await this.app.store.getThings({
            filter: {
                id,
                type: "user"
            },
            countOnly: true
        });
        return rtn.count > 0;
    }

    public async createUser(slug: string, password: string) {
        const hash = await bcrypt.hash(password, 10);

        const userThing = thing("user", v4());
        const passwordThing = thing("password");
        const hashThing = thing("string", hash);
        const algoThing = thing("algorithm", "bcrypt");
        const slugThing = thing("string", slug);

        await this.app.store.addAll(
            userThing,
            passwordThing,
            rel(userThing, "password", passwordThing),
            hashThing,
            rel(passwordThing, "hash", hashThing),
            algoThing,
            rel(passwordThing, "algorithm", algoThing),
            slugThing,
            rel(userThing, "slug", slugThing)
        );
        return userThing.id;
    }
}