import { App } from "./app";
import { addData } from "./data/data-seeder";
import { Store } from "./models/store";

const store = new Store();
addData(store);
const app = new App(store);
app.run(8080);