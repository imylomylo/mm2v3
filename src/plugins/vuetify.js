// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
// Vuetify
import { createVuetify, ThemeDefinition } from 'vuetify'

export default createVuetify(
  {
    theme: {
      dark: false, // or true if you want a dark theme
      themes: {
        light: {
          red: '#FF101F', // your primary color
          green: '#399E5A', // your secondary color
          accent: '#8c9eff', // your accent color
        },
      }
    }
}
)
