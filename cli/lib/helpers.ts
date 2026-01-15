import z from "zod";
import { env } from "./env.ts";

const packageSchemaType = z.object({
  version: z.string(),
  name: z.string(),
  license: z.string(),
});

export async function fetchLatestTwemojiVersion(): Promise<z.infer<typeof packageSchemaType>> {
  const twemojiApiPackage = await fetch(
    "https://registry.npmjs.org/@twemoji/api/latest",
  );
  const result = await twemojiApiPackage.json();
  const validation = await packageSchemaType.parseAsync(result);
  return validation;
}

/**
 * Checks if a GitHub tag exists for a given version
 * @param version The version to check
 * @returns true if the tag exists, false otherwise
 */
export async function checkIfTagExists(version: string): Promise<boolean> {
  try {
    // Get repository name from GitHub Actions environment or use default
    const [owner, repoName] = env.GITHUB_REPOSITORY.split("/", 2);

    if (owner == null || repoName == null) {
      console.error("Invalid repository format. Expected 'owner/repo'");
      return false;
    }

    const headers = new Headers([["Accept", "application/vnd.github.v3+json"]]);
    if (env.GITHUB_TOKEN != null) {
      headers.set("Authorization", "Bearer " + env.GITHUB_TOKEN);
    }

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repoName}/git/ref/tags/v${version}`,
      {
        headers,
      },
    );

    // If response is 200, the tag exists
    // If response is 404, the tag doesn't exist
    return response.status === 200;
  } catch (error) {
    console.error(`Error checking tag v${version}:`, error);
    return false;
  }
}
