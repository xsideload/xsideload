import type { AppInfo, TweakInfo } from "@/scripts/lib/infoTypes";
import { base } from "@/info";

export { assetsRepo } from "@/info";

export type AppName = keyof typeof base;
export type TweakName = {
	[K in AppName]: (typeof base)[K] extends { readonly tweaks: any }
		? keyof (typeof base)[K]["tweaks"]
		: never;
}[AppName];

export const apps = new Map<AppName, AppInfo>();
export const tweaks = new Map<TweakName, TweakInfo>();
const tweakNameToAppName = new Map<TweakName, AppName>();

for (const [appName, appData] of Object.entries(base) as [
	AppName,
	(typeof base)[AppName]
][]) {
	const { tweaks: appTweaks, ...appInfo } = appData;
	apps.set(appName, appInfo);
	if (appTweaks) {
		for (const [tweakName, tweakData] of Object.entries(appTweaks) as [
			TweakName,
			TweakInfo
		][]) {
			tweaks.set(tweakName, tweakData);
			tweakNameToAppName.set(tweakName, appName);
		}
	}
}

export const getAppInfoFromTweakName = (tweakName: TweakName) => {
	const appName = tweakNameToAppName.get(tweakName);
	if (appName) {
		return {
			name: appName,
			...apps.get(appName)
		};
	}
};
