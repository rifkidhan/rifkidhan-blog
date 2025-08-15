export class TableOfContent extends HTMLElement {
	#current = this.querySelector<HTMLAnchorElement>('a[aria-current="location"]');

	protected set current(link: HTMLAnchorElement) {
		if (link === this.#current) return;
		if (this.#current) this.#current.removeAttribute("aria-current");
		link.setAttribute("aria-current", "location");
		this.#current = link;
	}

	#onIdle = (cb: IdleRequestCallback) =>
		(window.requestIdleCallback || ((cb) => setTimeout(cb, 1)))(cb);

	constructor() {
		super();
		this.#onIdle(() => this.#init());
	}

	#init = (): void => {
		const links = [...this.querySelectorAll("a")];

		const isHeading = (el: Element): el is HTMLHeadingElement => {
			if (el instanceof HTMLHeadingElement) {
				if (el.id === "_top") return true;

				const level = el.tagName[1];

				if (level) {
					const int = parseInt(level, 10);
					if (int >= 2 && int <= 3) return true;
				}
			}

			return false;
		};

		const getHeading = (el: Element | null): HTMLHeadingElement | null => {
			if (!el) return null;
			const origin = el;
			while (el) {
				if (isHeading(el)) return el;

				el = el.previousElementSibling;

				while (el?.lastElementChild) {
					el = el.lastElementChild;
				}

				const h = getHeading(el);

				if (h) return h;
			}

			return getHeading(origin.parentElement);
		};

		const setCurrent: IntersectionObserverCallback = (entries) => {
			for (const { isIntersecting, target } of entries) {
				if (!isIntersecting) continue;

				const heading = getHeading(target);
				if (!heading) continue;

				const link = links.find((v) => v.hash === `#${encodeURIComponent(heading.id)}`);

				if (link) {
					this.current = link;
					break;
				}
			}
		};

		const toObserve = document.querySelectorAll("main [id] ~ *");

		let observer: IntersectionObserver | undefined;

		const observe = () => {
			if (observer) return;
			observer = new IntersectionObserver(setCurrent, { rootMargin: this.#getRootMargin() });
			toObserve.forEach((h) => observer!.observe(h));
		};

		observe();

		let timeout: NodeJS.Timeout;

		window.addEventListener("resize", () => {
			if (observer) {
				observer.disconnect();
				observer = undefined;
			}
			clearTimeout(timeout);
			timeout = setTimeout(() => this.#onIdle(observe), 200);
		});
	};

	#getRootMargin = (): `-${number}px 0% ${number}px` => {
		const headerHeight = document.querySelector("header")?.getBoundingClientRect().height || 0;
		const mobileTocHeight = this.querySelector("summary")?.getBoundingClientRect().height || 0;

		const top = mobileTocHeight + headerHeight + 16 * 16;
		const bottom = top + 53;

		const height = document.documentElement.clientHeight;

		return `-${top}px 0% ${bottom - height}px`;
	};
}
customElements.define("rifkidhan-toc", TableOfContent);
