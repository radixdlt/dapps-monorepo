// vite.config.js
import { sveltekit } from "file:///home/aleworm/dashboard/node_modules/@sveltejs/kit/src/exports/vite/index.js";
var config = ({ command }) => ({
  plugins: [
    sveltekit()
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9hbGV3b3JtL2Rhc2hib2FyZC9hcHBzL2Rhc2hib2FyZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvYWxld29ybS9kYXNoYm9hcmQvYXBwcy9kYXNoYm9hcmQvdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvYWxld29ybS9kYXNoYm9hcmQvYXBwcy9kYXNoYm9hcmQvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBzdmVsdGVraXQgfSBmcm9tICdAc3ZlbHRlanMva2l0L3ZpdGUnXG5cbi8qKiBAdHlwZSB7aW1wb3J0KCd2aXRlJykuVXNlckNvbmZpZ0ZufSAqL1xuY29uc3QgY29uZmlnID0gKHsgY29tbWFuZCB9KSA9PiAoe1xuXHRwbHVnaW5zOiBbXG5cdFx0c3ZlbHRla2l0KClcblx0XSxcblx0Li4uKCgpID0+ICh7XG5cdFx0c2VydmU6IHtcblx0XHRcdGJ1aWxkOiB7XG5cdFx0XHRcdG1pbmlmeTogZmFsc2UsXG5cdFx0XHRcdHNvdXJjZW1hcDogdHJ1ZVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0YnVpbGQ6IHtcblx0XHRcdGJ1aWxkOiB7XG5cdFx0XHRcdG1pbmlmeTogdHJ1ZSxcblx0XHRcdFx0c291cmNlbWFwOiBmYWxzZVxuXHRcdFx0fVxuXHRcdH1cblx0fVtjb21tYW5kXSkpKClcbn0pXG5cbmV4cG9ydCBkZWZhdWx0IGNvbmZpZ1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFvUyxTQUFTLGlCQUFpQjtBQUc5VCxJQUFNLFNBQVMsQ0FBQyxFQUFFLFFBQVEsT0FBTztBQUFBLEVBQ2hDLFNBQVM7QUFBQSxJQUNSLFVBQVU7QUFBQSxFQUNYO0FBQUEsRUFDQSxJQUFJLE9BQU87QUFBQSxJQUNWLE9BQU87QUFBQSxNQUNOLE9BQU87QUFBQSxRQUNOLFFBQVE7QUFBQSxRQUNSLFdBQVc7QUFBQSxNQUNaO0FBQUEsSUFDRDtBQUFBLElBQ0EsT0FBTztBQUFBLE1BQ04sT0FBTztBQUFBLFFBQ04sUUFBUTtBQUFBLFFBQ1IsV0FBVztBQUFBLE1BQ1o7QUFBQSxJQUNEO0FBQUEsRUFDRCxHQUFFLE9BQU8sR0FBSTtBQUNkO0FBRUEsSUFBTyxzQkFBUTsiLAogICJuYW1lcyI6IFtdCn0K
