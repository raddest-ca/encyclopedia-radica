import { App } from "./app";
import { addData } from "./data/seeder";
import { Store } from "./data/store";
import "dotenv/config";

async function main() {
    const store = new Store();
    addData(store);
    const app = new App(store);
    await app.setup();
    await app.run(80, 443);
}
main();