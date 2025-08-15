import type { MarkdownHeading } from "astro";

export interface TocItem extends MarkdownHeading {
	subheading: TocItem[];
}

export type TOCProps = {
	headings: MarkdownHeading[];
	title: string;
};

export function generateToc(headings: MarkdownHeading[], title: string) {
	headings = headings.filter(({ depth }) => depth >= 1 && depth <= 3);
	const toc: Array<TocItem> = [{ depth: 2, slug: "_top", text: title, subheading: [] }];
	for (const heading of headings) injectChild(toc, { ...heading, subheading: [] });
	return toc;
}

function injectChild(items: TocItem[], item: TocItem): void {
	const lastItem = items.at(-1);
	if (!lastItem || lastItem.depth >= item.depth) {
		items.push(item);
	} else {
		// biome-ignore lint/correctness/noVoidTypeReturn: safe for reason
		return injectChild(lastItem.subheading, item);
	}
}
