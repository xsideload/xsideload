export type AppInfo = {
	readonly bundleIdentifier: string;
};

export type TweakInfo = {
	readonly actionRepo: {
		readonly owner: string;
		readonly repo: string;
		readonly basehead: string;
	};
};

type BaseShape = {
	[key: string]: AppInfo & { tweaks: { [key: string]: TweakInfo } };
};

export const defineBase = <const T extends BaseShape>(base: T): T => {
	return base;
};
