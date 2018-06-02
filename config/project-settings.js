/*
  Project config
  @multiTheme
    @enabled - to enable multi theme
    @defaultTheme - set default themes
    @themes - set arr of desired themes @dark / @light
 */
const themes = ['dark', 'light'];

module.exports = {
  multiTheme: {
    enabled: true,
    defaultTheme: themes[0],
    themes,
  },
};
