import PackageJson from "@npmcli/package-json";
import path from "node:path";
import { downloadAndExtractFile } from "./lib/degit.ts";
import { fetchLatestTwemojiVersion as fetchLatestTwemojiData } from "./lib/helpers.ts";

const pkgFolder = path.join(process.cwd(), "..", "pkg");

const latestVersion = await fetchLatestTwemojiData();

const downloadFolder = path.join(pkgFolder, "dist");
await downloadAndExtractFile(
  "https://github.com/jdecked/twemoji",
  "assets/svg",
  downloadFolder,
);

const pkg = await PackageJson.create(path.join(pkgFolder), {
  data: {
    name: "@yovach/twemoji",
    license: latestVersion.license,
    version: latestVersion.version,
    files: ["dist"],
    exports: {
      "./*": "./dist/*.svg",
    }
  },
});
await pkg.save();

await pkg.fix();
