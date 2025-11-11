export const BASE_URL = process.env.BASE_URL;
if (!BASE_URL) throw new Error("BASE_URL missing");

const WEB_USERNAME = process.env.WEB_USERNAME;
if (!WEB_USERNAME) throw new Error("WEB_USERNAME missing");
const WEB_PASSWORD = process.env.WEB_PASSWORD;
if (!WEB_PASSWORD) throw new Error("WEB_PASSWORD missing");

export const BASE_URL_WITH_BASIC_AUTH = BASE_URL.replace(
	"://",
	`://${WEB_USERNAME}:${WEB_PASSWORD}@`
);
