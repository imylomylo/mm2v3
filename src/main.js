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

loadFonts()
createApp(App)
  .use(router)
  .use(vuetify, {
    theme:{
      themes:theme.themes,
    }
  })
  .use(theme)
  .mount('#app')
