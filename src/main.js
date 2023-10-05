import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { loadFonts } from './plugins/webfontloader'
import theme from './theme'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import {ref} from 'vue'

const vuetify = createVuetify({
  components,
  directives, 
})
const selectedTheme = ref('komodo'); // Default to Komodo theme

loadFonts()
createApp(App)
  .use(router)
  .use(vuetify)
  .use(theme)
  .mount('#app')
