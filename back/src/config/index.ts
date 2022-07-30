import { LogLevel } from "bunyan";

export const config: {
	tenant_id: string;
	client_id: string;
	session_secret: string;
	log_level_app: LogLevel;
	log_level_router: LogLevel;
	log_level_store: LogLevel;
} = {
	log_level_app: "debug",
	log_level_router: "debug",
	log_level_store: "info",
	...process.env as any
};
