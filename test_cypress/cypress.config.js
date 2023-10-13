const { defineConfig } = require("cypress");

const envUrls = {
  'dev': 'https://beta.multi-chat.data-artist.info/',
  'stg': 'https://test.multi-chat.data-artist.info/',
  'prod': 'https://mugen-ai-chat.jp/'
};

const baseUrl = envUrls[process.env.ENVIRONMENT || 'dev'];

module.exports = defineConfig({
  defaultCommandTimeout: 20000,
  numTestsKeptInMemory: 4,
  experimentalMemoryManagement: true,
  env: {
    host: baseUrl,
  },
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  video: false,
});
