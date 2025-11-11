import { defineBase } from "@/scripts/lib/infoTypes";

export const assetsRepo = { owner: "xsideload", repo: "assets" } as const;

export const base = defineBase({
	YouTube: {
		bundleIdentifier: "com.google.ios.youtube",
		tweaks: {
			YTLite: {
				actionRepo: {
					owner: "xsideload",
					repo: "YTLite",
					basehead: "main...dayanch96:YTLite:main"
				}
			}
		}
	},
	YouTubeMusic: {
		bundleIdentifier: "com.google.ios.youtubemusic",
		tweaks: {
			YTMusicUltimate: {
				actionRepo: {
					owner: "xsideload",
					repo: "YTMusicUltimate",
					basehead: "main...dayanch96:YTMusicUltimate:main"
				}
			}
		}
	}
});
