// @ts-check

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import sectionize from "@hbsnow/rehype-sectionize";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";

const NETLIFY_PREVIEW_SITE = process.env.CONTEXT !== "production" && process.env.DEPLOY_PRIME_URL;

// https://astro.build/config
export default defineConfig({
	site: NETLIFY_PREVIEW_SITE || "https://rifkidhan.my.id",
	integrations: [mdx(), sitemap()],
	trailingSlash: "ignore",
	image: {
		layout: "constrained",
		breakpoints: [640, 828, 1280, 1668],
	},
	markdown: {
		remarkRehype: {
			footnoteLabel: "Catatan Kaki",
		},
		rehypePlugins: [sectionize],
	},
	build: {
		format: "file",
	},
	prefetch: {
		prefetchAll: true,
	},
	devToolbar: {
		enabled: false,
	},
	experimental: {
		fonts: [
			{
				provider: fontProviders.google(),
				name: "Plus Jakarta Sans",
				cssVariable: "--font-pjs",
				weights: ["200 800"],
				subsets: ["latin"],
			},
		],
		contentIntellisense: true,
	},
	vite: {
		plugins: [tailwindcss()],
	},
});
