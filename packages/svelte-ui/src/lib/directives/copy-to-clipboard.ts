const tooltipTimer = 2_000;
const showTooltipClassNames = ['cooltipz--top', 'cooltipz--visible'];

export function copyToClipboard(node: HTMLElement, text: string) {
	let setTimeoutInstance: ReturnType<typeof setTimeout>;

	node.classList.add('tooltip-wrapper');
	node.setAttribute('aria-label', 'Copied!');

	const eventListener = (event: MouseEvent) => {
		event.stopPropagation();
		event.preventDefault();
		node.classList.add(...showTooltipClassNames);
		navigator.clipboard.writeText(text);
		if (setTimeoutInstance) clearTimeout(setTimeoutInstance);

		setTimeoutInstance = setTimeout(() => {
			node.classList.remove(...showTooltipClassNames);
		}, tooltipTimer);
	};
	node.addEventListener('click', eventListener);

	return {
		destroy() {
			if (setTimeoutInstance) clearTimeout(setTimeoutInstance);
			node.removeAttribute('aria-label');
			node.removeEventListener('click', eventListener);
		}
	};
}
