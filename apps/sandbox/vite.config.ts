import generateFile from 'vite-plugin-generate-file'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { aliases } from '../../aliases'
import { resolve } from 'path'
import { env } from 'process'

const config = {
  Mainnet: {
    dappDefinitionAccount:
      'account_rdx12y7md4spfq5qy7e3mfjpa52937uvkxf0nmydsu5wydkkxw3qx6nghn'
  },
  Stokenet: {
    dappDefinitionAccount:
      'account_tdx_2_12yf9gd53yfep7a669fv2t3wm7nz9zeezwd04n02a433ker8vza6rhe'
  }
}

const mappedAliases = Object.entries<string>(aliases()).reduce(
  (obj, [key, value]) => ({
    [key]: resolve(__dirname, value),
    ...obj
  }),
  {}
)

const dAppDefinitionAddress =
  config[env.network_name || 'Mainnet']?.dappDefinitionAccount ||
  config.Mainnet.dappDefinitionAccount

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    generateFile([
      {
        type: 'json',
        output: '.well-known/radix.json',
        data: {
          dApps: [
            {
              dAppDefinitionAddress
            }
          ]
        }
      }
    ])
  ],
  resolve: {
    alias: {
      ...mappedAliases
    }
  }
})
