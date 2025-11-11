import {
	assetsRepo,
	getAppInfoFromTweakName,
	type TweakName
} from "@/scripts/lib/info";
import { getOneArg } from "@/scripts/lib/args";
import { resolvePath, basename } from "@/scripts/lib/path";
import { confirm } from "@/scripts/lib/prompt";
import { getIpaVersionFilePath } from "@/scripts/lib/getIpaVersion";
import { octokit } from "@/scripts/lib/github";
import { readFileSync } from "node:fs";

export const uploadPrebuilt = async ({
	tweakName,
	optionalNotes,
	getTweakVersion
}: {
	tweakName: TweakName;
	optionalNotes?: string;
	getTweakVersion?: ({ fileName }: { fileName: string }) => string;
}) => {
	const oneArg = getOneArg();
	const filePath = resolvePath(oneArg);
	const appVersion = await getIpaVersionFilePath(filePath);
	console.log("- appVersion:", appVersion);
	const tweakVersion = getTweakVersion
		? getTweakVersion({ fileName: basename(filePath) })
		: "0";
	console.log("- tweakVersion:", tweakVersion);
	const appName = getAppInfoFromTweakName(tweakName)?.name;
	const tagName = optionalNotes
		? `${appName}_${appVersion}_${tweakName}_${tweakVersion}_${optionalNotes}`
		: `${appName}_${appVersion}_${tweakName}_${tweakVersion}`;
	const newFileName = `${tagName}.ipa`;

	console.log("- newFileName:", newFileName);
	console.log("- Creating release", tagName);
	console.log("- Uploading", filePath);
	console.log();
	await confirm();

	const release = await octokit.rest.repos.createRelease({
		...assetsRepo,
		tag_name: tagName
	});

	if (!release.data.id) throw new Error("createRelease error");

	const asset = await octokit.rest.repos.uploadReleaseAsset({
		...assetsRepo,
		release_id: release.data.id,
		name: newFileName,
		data: readFileSync(filePath) as unknown as string
	});

	console.log(`Uploaded ${asset.data.name} to ${release.data.html_url}`);
};
