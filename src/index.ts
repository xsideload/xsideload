import { Hono } from "hono";
import { basicAuth } from "hono/basic-auth";
import { Octokit } from "octokit";
import { assetsRepo } from "@/info";
import repoJson from "@/generated/repo.json" with { type: "json" };

const app = new Hono<{
	Bindings: CloudflareBindings;
	Variables: {
		octokit: Octokit;
	};
}>();

app.use(
	"/*",
	// Basic Auth Middleware
	async (c, next) => {
		const auth = basicAuth({
			username: c.env.WEB_USERNAME,
			password: c.env.WEB_PASSWORD
		});
		return auth(c, next);
	},
	// Octokit Middleware
	async (c, next) => {
		if (c.get("octokit")) {
			return await next();
		}
		const token = c.env.GH_TOKEN;
		if (!token) {
			console.error("GH_TOKEN is not set in Cloudflare environment");
			return c.json({ error: "Server configuration error" }, 500);
		}

		const octokit = new Octokit({
			auth: token
		});
		c.set("octokit", octokit);
		await next();
	}
);

app.get("/repo.json", async (c) => {
	return c.json({
		name: "xsideload repo",
		identifier: "xsideload.repo",
		iconURL: `${c.env.BASE_URL}/icon.jpg`,
		apps: repoJson
	});
});

app.get("/download/:id/:name?", async (c) => {
	const { id } = c.req.param();
	const octokit = c.get("octokit");

	const assets = await octokit.request(
		"HEAD /repos/{owner}/{repo}/releases/assets/{asset_id}",
		{
			...assetsRepo,
			asset_id: +id,
			headers: {
				accept: "application/octet-stream"
			}
		}
	);

	if (assets.url) return c.redirect(assets.url);
});

export default app;
