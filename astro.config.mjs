import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import favicons from "astro-favicons";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import glsl from 'vite-plugin-glsl';
import vue from "@astrojs/vue";
import react from '@astrojs/react';

const base_url = process.env.BUILD_MODE === "test" ? "test-saharaa/" : "";


// https://astro.build/config
export default defineConfig({
  compressHTML: import.meta.env.PROD,
  site: 'https://saharalabs.ai/',
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport'
  },
  base: base_url,
  vite: {
    plugins: [glsl({
      warnDuplicatedImports: false,
      compress: true
    })]
  },
  integrations: [tailwind(), icon({
    iconDir: 'src/assets/icons'
  }), favicons({
    masterPicture: "./src/assets/favicon.svg",
    emitAssets: true,
    appName: "Sahara AI",
    appShortName: "Sahara",
    appDescription: "Your knowledge, your AI.Build the first decentralized AI network for fair and universal access to global knowledge capital.",
    developerName: "SaharaLabs",
    faviconsDarkMode: false,
    background: '#121315'
  }), sitemap(), vue(), react()]
});