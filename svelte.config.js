import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';
import UnoCss from 'unocss/vite'
import { extractorSvelte } from '@unocss/core'
import presetIcons from '@unocss/preset-icons'
import presetUno from '@unocss/preset-uno'
import { resolve } from 'path'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: preprocess(),
  kit: {
    adapter: adapter(),
    vite: {
      resolve: {
        alias: {
          src: resolve('./src')
        }
      },
      plugins: [
        UnoCss({
          extractors: [extractorSvelte],
          presets: [
            presetUno(),
            presetIcons(),
          ],
        }),
      ],
    },
  }
};

export default config;
