const { defineConfig } = require("cypress");

module.exports = defineConfig({
  video: true,
  videosFolder: "cypress/videos",
  screenshotsFolder: "cypress/screenshots",

  reporter: "cypress-mochawesome-reporter",

  reporterOptions: {
    reportDir: "cypress/reports",
    overwrite: false,
    html: true,
    json: true
  },

  e2e: {
    baseUrl: "https://opensource-demo.orangehrmlive.com",
    viewportWidth: 1280,
    viewportHeight: 720,
    setupNodeEvents(on, config) {
      require("cypress-mochawesome-reporter/plugin")(on);
    }
  },
});
