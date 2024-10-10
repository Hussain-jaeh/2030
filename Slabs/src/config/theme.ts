

/**
 * Theme For Styled Components
 * -
 */
export const appTheme = {
  background: '#222',
  primary: '#FFF',
  secondary: '#CCC',
  highlight: '#FF2353',
}

/**
 * Theme For Expo Navigation Header
 * -
 */
export const navTheme = {
  dark: false,
  colors: {
    background: appTheme.background,
    border: appTheme.secondary,
    card: appTheme.background,
    notification: appTheme.highlight,
    primary: appTheme.primary,
    text: appTheme.primary
  }
}
