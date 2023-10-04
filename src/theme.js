// theme.js

const themes = {
  komodo: {
    primary: '#4CAF50', // Green for Komodo
    secondary: '#424242',
    accent: '#82B1FF',
  },
  verus: {
    primary: '#1976D2', // Blue for Verus
    secondary: '#424242',
    accent: '#82B1FF',
  },
  zcash: {
    primary: '#FFD700', // Golden for Zcash
    secondary: '#FFFFFF', // White
    accent: '#82B1FF',
  },
};

export default {
  // Define your color palette
  theme: {
    dark: false, // Set to true for a dark theme
    themes: themes.komodo, // Default theme (Komodo)
  },
  themes, // Export all themes for dynamic switching
};
