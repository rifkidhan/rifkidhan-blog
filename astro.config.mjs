// @ts-check

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import sectionize from "@hbsnow/rehype-sectionize";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

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
	prefetch: {
		prefetchAll: true,
	},
	devToolbar: {
		enabled: false,
	},
	experimental: {
		fonts: [
			{
				provider: "local",
				name: "Plus Jakarta Sans",
				cssVariable: "--font-pjs",
				variants: [
					{
						src: ["./src/assets/PlusJakartaSans.woff2"],
						weight: "200 800",
						style: "normal",
						display: "swap",
					},
					{
						src: ["./src/assets/PlusJakartaSans-Italic.woff2"],
						weight: "200 800",
						style: "italic",
						display: "swap",
					},
				],
			},
		],
		contentIntellisense: true,
	},
	vite: {
		plugins: [tailwindcss()],
	},
});
