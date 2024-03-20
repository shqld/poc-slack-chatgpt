import * as fs from "node:fs";
import { App } from "@slack/bolt";

if (fs.existsSync(".env.local")) {
	const envs = fs
		.readFileSync(".env.local", "utf8")
		.trim()
		.split("\n")
		.filter((l) => !l.startsWith("#"));

	for (const env of envs) {
		let [key, value] = env.trim().split("=");

		process.env[key] = value;
	}
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});

async function main() {
	const app = new App({
		token: process.env.SLACK_BOT_TOKEN,
		signingSecret: process.env.SLACK_SIGNING_SECRET,
	});

	app.message("hello", async ({ message, say }) => {
		await say(`Hello, <@${message.type}>`);
	});

	const port = process.env.PORT || 3001;

	await app.start(port);
}
