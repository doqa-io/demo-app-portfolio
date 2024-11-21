const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://doqa.io",
    specPattern: "cypress/integration/**/*.cy.js",
    viewportWidth: 1280,
    viewportHeight: 720,
  },
});
