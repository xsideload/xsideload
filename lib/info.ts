import infoJson from "../info.json" assert { type: "json" };

export const info = infoJson;

export const assetsRepo = { owner: info.owner, repo: info.repo };
