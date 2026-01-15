import z from "zod";

// Schema for environment variables
const envSchema = z.object({
  GITHUB_REPOSITORY: z
    .templateLiteral([z.string(), "/", z.string()])
    .optional()
    .default("yovach/twemoji-svgs"),
  GITHUB_TOKEN: z.string().optional(),
});

export const env: z.infer<typeof envSchema> = envSchema.parse(process.env);
