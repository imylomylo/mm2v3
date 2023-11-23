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
          primary: '#3f51b5', // your primary color
          secondary: '#b0bec5', // your secondary color
          accent: '#8c9eff', // your accent color
        },
      }
    }
}
)
