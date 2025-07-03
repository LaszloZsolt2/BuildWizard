const { defineConfig } = require("cypress");

module.exports = defineConfig({
  component: {
    devServer: {
      framework: "vue",
      bundler: "vite",
    },
    specPattern: "cypress/test/**/*.cy.{js,ts,jsx,tsx}",
    //specPattern: "cypress/test/**/*.spec.{js,ts,jsx,tsx}",
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    viewportWidth: 1920,
    viewportHeight: 1080,
  },
});
