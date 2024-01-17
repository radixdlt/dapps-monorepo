export function isHovering(node: HTMLElement) {
	const handleMouseLeave = (event: Event) => {
		if (
			node &&
			event.target &&
			event.target instanceof Element &&
			!node.contains(event.target) &&
			!event.defaultPrevented
		) {
			node.dispatchEvent(new CustomEvent('mouse-is-not-hovering'));
		}
	};

	const handleMouseEnter = (event: Event) => {
		if (
			node &&
			event.target &&
			event.target instanceof Element &&
			node.contains(event.target) &&
			!event.defaultPrevented
		) {
			node.dispatchEvent(new CustomEvent('mouse-is-hovering'));
		}
	};

	document.addEventListener('mouseenter', handleMouseEnter, true);
	document.addEventListener('mouseleave', handleMouseLeave, true);

	return {
		destroy() {
			document.removeEventListener('mouseenter', handleMouseEnter, true);
			document.removeEventListener('mouseleave', handleMouseLeave, true);
		}
	};
}
