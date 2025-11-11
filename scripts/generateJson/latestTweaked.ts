import {
	assetsRepo,
	getAppInfoFromTweakName,
	TweakName
} from "@/scripts/lib/info";
import { parseReleaseTag } from "@/scripts/lib/release";
import { octokit } from "@/scripts/lib/github";
import { BASE_URL, BASE_URL_WITH_BASIC_AUTH } from "@/scripts/lib/url";
import { projectRoot } from "@/scripts/lib/path";
import { aNewerThanB } from "@/scripts/lib/compare";
import { writeFile } from "node:fs/promises";

const limit: number | null = null;

const result: { [key: string]: AppsJson } = {};

const releasesIterator = octokit.paginate.iterator(
	octokit.rest.repos.listReleases,
	{
		...assetsRepo,
		per_page: 100
	}
);

let releaseLoopCount = 0;
releaseLoop: for await (const { data: pageOfReleases } of releasesIterator) {
	for (const release of pageOfReleases) {
		if (limit !== null && releaseLoopCount >= limit) {
			break releaseLoop;
		}
		releaseLoopCount++;
		// Check each release
		const releaseInfo = parseReleaseTag(release.tag_name);
		if (releaseInfo.type === "tweaked" && releaseInfo.tweakName) {
			const appInfo = getAppInfoFromTweakName(
				releaseInfo.tweakName as TweakName
			);
			const asset = release.assets[0];
			if (
				asset &&
				aNewerThanB(
					releaseInfo.appVersion,
					result[releaseInfo.tweakName]?.version || ""
				)
			) {
				result[releaseInfo.tweakName] = {
					name: releaseInfo.tweakName,
					bundleIdentifier: appInfo?.bundleIdentifier || "",
					version: `${releaseInfo.appVersion}_${releaseInfo.tweakVersion}`,
					localizedDescription: asset.name,
					downloadURL: `${BASE_URL_WITH_BASIC_AUTH}/download/${asset.id}/${asset.name}`,
					iconURL: appInfo?.bundleIdentifier
						? `${BASE_URL}/icon/${appInfo?.bundleIdentifier}.jpg`
						: "",
					versionDate: asset.created_at,
					size: asset.size
				};
			}
		}
	}
}

try {
	await writeFile(
		`${projectRoot}/generated/repo.json`,
		JSON.stringify({
			name: "xsideload repo",
			identifier: "xsideload.repo",
			iconURL: `${BASE_URL}/icon.jpg`,
			apps: Object.values(result)
		})
	);
} catch (error) {
	console.error("Error writing JSON to file:", error);
}
