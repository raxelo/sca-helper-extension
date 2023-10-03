import { defineConfig } from 'unocss/vite'
import { presetIcons, presetWind, transformerDirectives } from 'unocss'

export default defineConfig({
  presets: [
    presetIcons(),
    presetWind(),
  ],
  transformers: [
    transformerDirectives(),
  ],
})
