import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
	loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updateDate: z.coerce.date().optional(),
			heroImage: image().optional(),
			heroImage_caption: z.string().optional(),
			published: z.boolean().default(false),
		}),
});

export const collections = { blog };
