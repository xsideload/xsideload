const collator = new Intl.Collator(undefined, {
	numeric: true,
	sensitivity: "base"
});

export const sortDesc = (a: string, b: string) => collator.compare(b, a);
