import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const stage = resolve(".desktop-build");
const rootPackage = JSON.parse(readFileSync(resolve("package.json"), "utf8"));

rmSync(stage, { recursive: true, force: true });
mkdirSync(stage, { recursive: true });
cpSync(resolve("dist"), resolve(stage, "dist"), { recursive: true });
cpSync(resolve("native", "desktop", "main.cjs"), resolve(stage, "main.cjs"));
cpSync(resolve("native", "desktop", "electron-builder.yml"), resolve(stage, "electron-builder.yml"));

writeFileSync(
  resolve(stage, "package.json"),
  JSON.stringify(
    {
      name: "scical600-desktop",
      version: rootPackage.version,
      private: true,
      main: "main.cjs",
      description: "SciCal600 offline desktop calculator client",
    },
    null,
    2,
  ) + "\n",
);

console.log(`Prepared desktop staging directory at ${stage}.`);
