import bcrypt from "bcrypt";
import { v4 } from "uuid";
import { App } from "../app";
import { meta, rel, thing } from "../models/helpers";

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
				type: "user",
			},
		});
		return rtn.values;
	}

	public async userExists(id: string) {
		const rtn = await this.app.store.countThings({
			filter: {
				id,
				type: "user",
			},
		});
		return rtn > 0;
	}

	public async createUser(slug: string, password: string) {
        const existingCount = await this.app.store.countRelationships({
            filter: {
                left: {
                    type: "user",
                },
                type: "slug",
                right: {
                    type: "string",
                    id: slug
                }
            }
        });
        // todo: create user-facing error type, check w/ instanceof
        // todo: add localization for server errors :P
        if (existingCount > 0) throw new Error("slug taken");


		const salt = await bcrypt.genSalt();
		const hash = await bcrypt.hash(password, salt);

		const userThing = thing("user", v4());
		const passwordThing = thing("password");
		const hashThing = thing("string", hash);
		const saltThing = thing("string", salt);
		const algoThing = thing("algorithm", "bcrypt");
		const slugThing = thing("string", slug);

		/*
		user:
			!id						# not allowed to be specified
			slug: string
			password:
				!id					# not allowed to be specified
				hash: string
				salt: string
				algorithm: string
		*/

		await this.app.store.addAll(
			userThing,
			passwordThing,
			rel(userThing, "password", passwordThing),
			hashThing,
			rel(passwordThing, "hash", hashThing),
            saltThing,
            rel(passwordThing, "salt", saltThing),
			algoThing,
			rel(passwordThing, "algorithm", algoThing),
			slugThing,
			rel(userThing, "slug", slugThing),
			...meta(userThing).all
		);
		return userThing.id;
	}
}
