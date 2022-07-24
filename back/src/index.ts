import { App } from "./app";
import { addData } from "./data/seeder";
import { Store } from "./data/store";
import "dotenv/config";

const store = new Store();
addData(store);
const app = new App(store);
// app.run(8080);
app.run(80, 443);