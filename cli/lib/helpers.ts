import z from "zod";

const packageSchemaType: z.ZodObject<
  {
    version: z.ZodString;
    name: z.ZodString;
    license: z.ZodString;
  },
  z.z.core.$strip
> = z.object({
  version: z.string(),
  name: z.string(),
  license: z.string(),
});

export type PackageSchemaType = z.infer<typeof packageSchemaType>;

export async function fetchLatestTwemojiVersion(): Promise<PackageSchemaType> {
  const twemojiApiPackage = await fetch(
    "https://registry.npmjs.org/@twemoji/api/latest",
  );
  const result = await twemojiApiPackage.json();
  const validation = await packageSchemaType.parseAsync(result);
  return validation;
}
