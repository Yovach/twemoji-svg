import PackageJson from "@npmcli/package-json";
import path from "node:path";
import { downloadAndExtractFile } from "./lib/degit.ts";
import {
  fetchLatestTwemojiVersion as fetchLatestTwemojiData,
  checkIfTagExists,
} from "./lib/helpers.ts";
import { env } from "./lib/env.ts";

const pkgFolder = path.join(process.cwd(), "..", "pkg");

const latestVersion = await fetchLatestTwemojiData();

// Check if a tag already exists for this version
const tagExists = await checkIfTagExists(latestVersion.version);

if (tagExists) {
  console.log(
    `Version v${latestVersion.version} already exists. No update needed.`,
  );
  process.exit(1);
}

console.log(`New version detected: v${latestVersion.version}. Updating...`);

const downloadFolder = path.join(pkgFolder, "dist");
await downloadAndExtractFile(
  "https://github.com/jdecked/twemoji",
  "assets/svg",
  downloadFolder,
);

const pkg = await PackageJson.create(path.join(pkgFolder), {
  data: {
    name: "twemoji-svg",
    license: latestVersion.license,
    version: latestVersion.version,
    files: ["dist"],
    repository: {
      type: "git",
      url: "git+https://github.com/" + env.GITHUB_REPOSITORY + ".git"
    },
    exports: {
      "./*": "./dist/*.svg",
    },
  },
});

await pkg.save();

console.log(`Update completed for version v${latestVersion.version}`);
console.log(`Tag v${latestVersion.version} will be created by GitHub Actions`);
