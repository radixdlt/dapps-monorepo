<script lang="ts">
	import { onDestroy, createEventDispatcher, onMount } from 'svelte'
  
	export let threshold = 5
	export let middlePageMode = false
  
	const dispatch = createEventDispatcher()
	let component: HTMLElement
	let scrollableParent: HTMLElement | null
	let resizeObserver: ResizeObserver
  
	const onResize = () => {
	  assignScrollableParent()
	}
  
	window.addEventListener('resize', onResize)
  
	const findParentWithCorrectDisplay = (
	  component: HTMLElement | null
	): HTMLElement | null => {
	  if (component) {
		if (getComputedStyle(component).display === 'contents') {
		  return findParentWithCorrectDisplay(component.parentElement)
		} else {
		  return component
		}
	  }
	  return null
	}
  
	const findParentWithScroll = (
	  component: HTMLElement | null
	): HTMLElement | null => {
	  if (component) {
		const element: HTMLElement | null = component.parentElement
		if (
		  element &&
		  element.clientHeight < element.scrollHeight &&
		  getComputedStyle(element).overflowY !== 'hidden'
		) {
		  return element
		}
		return findParentWithScroll(element)
	  }
	  return null
	}
  
	const assignScrollableParent = () => {
	  scrollableParent = findParentWithScroll(component)
	  scrollableParent?.addEventListener('scroll', onScroll)
	  if (!scrollableParent) {
		dispatch('noScrollableParent')
	  }
	}
  
	onMount(() => {
	  assignScrollableParent()
	  resizeObserver = new ResizeObserver(() => {
		assignScrollableParent()
	  })
  
	  const parentElement = findParentWithCorrectDisplay(component.parentElement)
	  if (parentElement) {
		resizeObserver.observe(parentElement)
	  }
	})
  
	const onScroll = (e: any) => {
	  if (middlePageMode) {
		if (
		  component.parentElement?.clientHeight &&
		  component.parentElement?.clientHeight - e.target.scrollTop < 2500
		) {
		  dispatch('thresholdReached')
		}
	  }
  
	  const offset =
		e.target.scrollHeight - e.target.clientHeight - e.target.scrollTop
  
	  const adjustedThreshold = threshold < 1 ? 1 : threshold
	  if (offset <= adjustedThreshold) {
		dispatch('thresholdReached')
	  }
	}
  
	onDestroy(() => {
	  window.removeEventListener('resize', onResize)
	  scrollableParent?.removeEventListener('scroll', onScroll)
	  resizeObserver.disconnect()
	})
  </script>
  
  <div bind:this={component} />
  