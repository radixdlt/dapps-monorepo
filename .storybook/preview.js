import ThemeDecorator from './ThemeDecorator.svelte';

export const decorators = [(_, story) => ({ Component: ThemeDecorator, props: { context: story.globals } })];

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  }
}
