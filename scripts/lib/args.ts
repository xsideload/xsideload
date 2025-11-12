import { parseArgs } from "node:util";

export const getOneArg = () => {
	const { positionals } = parseArgs({ allowPositionals: true });
	if (positionals.length !== 1) throw new Error("Missing one argument");
	return positionals[0];
};
