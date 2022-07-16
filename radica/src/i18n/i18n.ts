import { addMessages, getLocaleFromNavigator, init } from "svelte-i18n";
import enCA from "./en-CA.json";

export function setup() {
    addMessages("en-CA", enCA);

    init({
        fallbackLocale: "en-CA",
        initialLocale: getLocaleFromNavigator(),
    });
}
