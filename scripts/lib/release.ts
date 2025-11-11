/* Release format
 * `${AppName}_${AppVersion}_${OptionalNotes}`
 * `${AppName}_${AppVersion}_${TweakName}_${TweakVersion}_${OptionalNotes}`
 */

export const parseReleaseTag = (
	tag_name: string
):
	| {
			type: "decrypted";
			appName: string;
			appVersion: string;
			optionalNotes: string | undefined;
	  }
	| {
			type: "tweaked";
			appName: string;
			appVersion: string;
			tweakName: string;
			tweakVersion: string;
			optionalNotes: string | undefined;
	  } => {
	const splitted = tag_name.split("_");
	switch (splitted.length) {
		case 2:
		case 3:
			return {
				type: "decrypted",
				appName: splitted[0],
				appVersion: splitted[1],
				optionalNotes: splitted[2]
			};

		case 4:
		case 5:
			return {
				type: "tweaked",
				appName: splitted[0],
				appVersion: splitted[1],
				tweakName: splitted[2],
				tweakVersion: splitted[3],
				optionalNotes: splitted[4]
			};

		default:
			throw new Error("parseReleaseTag error");
	}
};
