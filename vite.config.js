const { resolve } = require("path");

module.exports = {
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        "taking-root": resolve(__dirname, "taking-root/index.html"),
      },
    },
  },
};
