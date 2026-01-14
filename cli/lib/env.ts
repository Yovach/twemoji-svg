import z from "zod";

// Schema for environment variables
const envSchema = z.object({
  GITHUB_REPOSITORY: z.string().optional().default("yovach/twemoji-svgs"),
  GITHUB_TOKEN: z.string().optional(),
});

export const env: {
    GITHUB_REPOSITORY: string;
    GITHUB_TOKEN?: string | undefined;
} = envSchema.parse(process.env);