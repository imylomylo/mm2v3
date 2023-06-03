import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
import vuetify from 'vite-plugin-vuetify'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
		vue(),
		vueJsx(),
		vuetify({ autoImport: true }),
	],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  define: {
    'process.env': {
      VITE_VUE_APP_MMBOTURL: process.env.VITE_VUE_APP_MMBOTURL,
      VITE_VUE_APP_MENAME: process.env.VITE_VUE_APP_MENAME,
      VITE_VUE_APP_WEBHOST: process.env.VITE_VUE_APP_WEBHOST,
      VITE_VUE_APP_MMBOTHOST: process.env.VITE_VUE_APP_MMBOTHOST,
      VITE_VUE_APP_MMBOTPORT: process.env.VITE_VUE_APP_MMBOTPORT,
      VITE_VUE_APP_ME_PRIVATE: process.env.VITE_VUE_APP_ME_PRIVATE,
      VITE_VUE_APP_ME_PUBLIC: process.env.VITE_VUE_APP_ME_PUBLIC
    }
  }
})
