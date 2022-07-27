import { LogLevel } from "bunyan";

export const config: {
	tenant_id: string;
	client_id: string;
	session_secret: string;
	log_level: LogLevel;
} = process.env as any;
