import ThemeDecorator from './ThemeDecorator.svelte'
import './__mocks__/accounts'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  },
  viewport: {
    viewports: {
      '14" laptop': {
        name: '14" laptop',
        styles: {
          width: '1600px',
          height: '900px'
        }
      },
      mobile: {
        name: 'mobile',
        styles: {
          width: '393px',
          height: '900px'
        }
      }
    }
  }
}

export const decorators = [() => ThemeDecorator]
