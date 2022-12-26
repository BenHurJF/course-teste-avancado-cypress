const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://wlsf82-hacker-stories.web.app',
    setupNodeEvents(on, config){
      require('@cypress/grep/src/plugin')(config);
      return config;
    },
    chromeWebSecurity: false,
    experimentalSessionAndOrigin: true,
  },
})