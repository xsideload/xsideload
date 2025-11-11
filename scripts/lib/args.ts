import process from "node:process";

export const getOneArg = () => {
	if (process.argv.length < 2) throw new Error("Missing one argument");
	const oneArg = process.argv[2];
	return oneArg;
};

export const hasOneArg = () => process.argv.length === 3;
