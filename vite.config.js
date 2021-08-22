const { resolve } = require("path");

module.exports = {
  base: '/ac-mus/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
    },
  },
};
