// vite.config.js
import { sveltekit } from "file:///Users/alex/Projects/dashboard/node_modules/@sveltejs/kit/src/exports/vite/index.js";

// configs.js
var configs = {
  flags: {
    isVitebook: process.env.VITEBOOK === "true"
  },
  alias: {
    "@components": "../../packages/ui/src/components",
    "@pages": "src/pages",
    "@styles": "../../packages/ui/src/styles.ts",
    "@directives": "../../packages/ui/src/directives",
    "@types": "src/types.ts",
    "@sdk": "src/mock-sdk.ts",
    "@gateway": "src/gateway.ts",
    "@configs": "configs.js",
    "@wallet": "src/wallet",
    "@api": "src/api",
    "@featureFlags": "src/feature-flags",
    "@stores": "../../packages/ui/src/stores.ts",
    "@utils": "../../packages/ui/src/utils",
    "@networks": "../../packages/ui/src/network.ts",
    "@constants": "../../packages/ui/src/constants.ts",
    "@images": "../../packages/ui/static/images",
    "@icons": "../../packages/ui/static/icons",
    "@fonts": "../../packages/ui/src/fonts.css"
  }
};

// vite.config.js
var config = ({ command }) => ({
  plugins: [
    !configs.flags.isVitebook ? sveltekit() : null
  ],
  ...(() => ({
    serve: {
      build: {
        minify: false,
        sourcemap: true
      }
    },
    build: {
      build: {
        minify: true,
        sourcemap: false
      }
    }
  })[command])()
});
var vite_config_default = config;
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiLCAiY29uZmlncy5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9hbGV4L1Byb2plY3RzL2Rhc2hib2FyZC9hcHBzL2Rhc2hib2FyZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2FsZXgvUHJvamVjdHMvZGFzaGJvYXJkL2FwcHMvZGFzaGJvYXJkL3ZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9hbGV4L1Byb2plY3RzL2Rhc2hib2FyZC9hcHBzL2Rhc2hib2FyZC92aXRlLmNvbmZpZy5qc1wiO2ltcG9ydCB7IHN2ZWx0ZWtpdCB9IGZyb20gJ0BzdmVsdGVqcy9raXQvdml0ZSdcbmltcG9ydCB7IGNvbmZpZ3MgfSBmcm9tICcuL2NvbmZpZ3MnXG5cbi8qKiBAdHlwZSB7aW1wb3J0KCd2aXRlJykuVXNlckNvbmZpZ0ZufSAqL1xuY29uc3QgY29uZmlnID0gKHsgY29tbWFuZCB9KSA9PiAoe1xuXHRwbHVnaW5zOiBbXG5cdFx0IWNvbmZpZ3MuZmxhZ3MuaXNWaXRlYm9vayA/IHN2ZWx0ZWtpdCgpIDogbnVsbFxuXHRdLFxuXHQuLi4oKCkgPT4gKHtcblx0XHRzZXJ2ZToge1xuXHRcdFx0YnVpbGQ6IHtcblx0XHRcdFx0bWluaWZ5OiBmYWxzZSxcblx0XHRcdFx0c291cmNlbWFwOiB0cnVlXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRidWlsZDoge1xuXHRcdFx0YnVpbGQ6IHtcblx0XHRcdFx0bWluaWZ5OiB0cnVlLFxuXHRcdFx0XHRzb3VyY2VtYXA6IGZhbHNlXG5cdFx0XHR9XG5cdFx0fVxuXHR9W2NvbW1hbmRdKSkoKVxufSlcblxuZXhwb3J0IGRlZmF1bHQgY29uZmlnXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9hbGV4L1Byb2plY3RzL2Rhc2hib2FyZC9hcHBzL2Rhc2hib2FyZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2FsZXgvUHJvamVjdHMvZGFzaGJvYXJkL2FwcHMvZGFzaGJvYXJkL2NvbmZpZ3MuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2FsZXgvUHJvamVjdHMvZGFzaGJvYXJkL2FwcHMvZGFzaGJvYXJkL2NvbmZpZ3MuanNcIjtleHBvcnQgY29uc3QgY29uZmlncyA9IHtcbiAgZmxhZ3M6IHtcbiAgICBpc1ZpdGVib29rOiBwcm9jZXNzLmVudi5WSVRFQk9PSyA9PT0gJ3RydWUnXG4gIH0sXG4gIGFsaWFzOiB7XG4gICAgJ0Bjb21wb25lbnRzJzogJy4uLy4uL3BhY2thZ2VzL3VpL3NyYy9jb21wb25lbnRzJyxcbiAgICAnQHBhZ2VzJzogJ3NyYy9wYWdlcycsXG4gICAgJ0BzdHlsZXMnOiAnLi4vLi4vcGFja2FnZXMvdWkvc3JjL3N0eWxlcy50cycsXG4gICAgJ0BkaXJlY3RpdmVzJzogJy4uLy4uL3BhY2thZ2VzL3VpL3NyYy9kaXJlY3RpdmVzJyxcbiAgICAnQHR5cGVzJzogJ3NyYy90eXBlcy50cycsXG4gICAgJ0BzZGsnOiAnc3JjL21vY2stc2RrLnRzJyxcbiAgICAnQGdhdGV3YXknOiAnc3JjL2dhdGV3YXkudHMnLFxuICAgICdAY29uZmlncyc6ICdjb25maWdzLmpzJyxcbiAgICAnQHdhbGxldCc6ICdzcmMvd2FsbGV0JyxcbiAgICAnQGFwaSc6ICdzcmMvYXBpJyxcbiAgICAnQGZlYXR1cmVGbGFncyc6ICdzcmMvZmVhdHVyZS1mbGFncycsXG4gICAgJ0BzdG9yZXMnOiAnLi4vLi4vcGFja2FnZXMvdWkvc3JjL3N0b3Jlcy50cycsXG4gICAgJ0B1dGlscyc6ICcuLi8uLi9wYWNrYWdlcy91aS9zcmMvdXRpbHMnLFxuICAgICdAbmV0d29ya3MnOiAnLi4vLi4vcGFja2FnZXMvdWkvc3JjL25ldHdvcmsudHMnLFxuICAgICdAY29uc3RhbnRzJzogJy4uLy4uL3BhY2thZ2VzL3VpL3NyYy9jb25zdGFudHMudHMnLFxuICAgICdAaW1hZ2VzJzogJy4uLy4uL3BhY2thZ2VzL3VpL3N0YXRpYy9pbWFnZXMnLFxuICAgICdAaWNvbnMnOiAnLi4vLi4vcGFja2FnZXMvdWkvc3RhdGljL2ljb25zJyxcbiAgICAnQGZvbnRzJzogJy4uLy4uL3BhY2thZ2VzL3VpL3NyYy9mb250cy5jc3MnXG4gIH1cbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBeVQsU0FBUyxpQkFBaUI7OztBQ0EzQixJQUFNLFVBQVU7QUFBQSxFQUN0VSxPQUFPO0FBQUEsSUFDTCxZQUFZLFFBQVEsSUFBSSxhQUFhO0FBQUEsRUFDdkM7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLGVBQWU7QUFBQSxJQUNmLFVBQVU7QUFBQSxJQUNWLFdBQVc7QUFBQSxJQUNYLGVBQWU7QUFBQSxJQUNmLFVBQVU7QUFBQSxJQUNWLFFBQVE7QUFBQSxJQUNSLFlBQVk7QUFBQSxJQUNaLFlBQVk7QUFBQSxJQUNaLFdBQVc7QUFBQSxJQUNYLFFBQVE7QUFBQSxJQUNSLGlCQUFpQjtBQUFBLElBQ2pCLFdBQVc7QUFBQSxJQUNYLFVBQVU7QUFBQSxJQUNWLGFBQWE7QUFBQSxJQUNiLGNBQWM7QUFBQSxJQUNkLFdBQVc7QUFBQSxJQUNYLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxFQUNaO0FBQ0Y7OztBRHBCQSxJQUFNLFNBQVMsQ0FBQyxFQUFFLFFBQVEsT0FBTztBQUFBLEVBQ2hDLFNBQVM7QUFBQSxJQUNSLENBQUMsUUFBUSxNQUFNLGFBQWEsVUFBVSxJQUFJO0FBQUEsRUFDM0M7QUFBQSxFQUNBLElBQUksT0FBTztBQUFBLElBQ1YsT0FBTztBQUFBLE1BQ04sT0FBTztBQUFBLFFBQ04sUUFBUTtBQUFBLFFBQ1IsV0FBVztBQUFBLE1BQ1o7QUFBQSxJQUNEO0FBQUEsSUFDQSxPQUFPO0FBQUEsTUFDTixPQUFPO0FBQUEsUUFDTixRQUFRO0FBQUEsUUFDUixXQUFXO0FBQUEsTUFDWjtBQUFBLElBQ0Q7QUFBQSxFQUNELEdBQUUsT0FBTyxHQUFJO0FBQ2Q7QUFFQSxJQUFPLHNCQUFROyIsCiAgIm5hbWVzIjogW10KfQo=
