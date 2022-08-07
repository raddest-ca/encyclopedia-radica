import { App } from "./app";
import fs from "fs";
import { config } from "./config";
import { createLogger } from "bunyan";
import path from "path";
import glob from "glob";

const logger = createLogger({ name: "router", level: config.log_level_router });;

function discoverRoutes(): Promise<string[]> {
	return new Promise((res, rej) => {
        const pattern = "routes/**/*.js!(.map)";
        logger.debug("looking for routes with glob pattern \"%s\"", pattern);
		glob(pattern, {
            cwd: __dirname
        }, (err, files) => {
            logger.debug({err, files}, "discovered files");
			if (err) rej(err);
			else res(files);
		});
	});
}

export async function setup(app: App) {
    logger.info("discovering routes");
    const routePaths = await discoverRoutes();
    logger.info("%d routes found.", routePaths.length);
    logger.info("attaching routes");
    for (const route of routePaths) {
        logger.debug("attaching route \"%s\"", route);
        const x = await import(path.join(__dirname, route));
        x.default(app);
    }
    logger.info("router setup complete");
}
