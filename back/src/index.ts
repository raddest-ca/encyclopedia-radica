import "dotenv/config";
import { App } from "./app";
import { addData } from "./data/seeder";
import { Store } from "./data/store";
import { Auth } from "./auth";

async function main() {
	const store = new Store();
	addData(store);
	const auth = new Auth();
	const app = new App(store, auth);
	await app.setup();
	await app.run(80, 443);
}
main();
