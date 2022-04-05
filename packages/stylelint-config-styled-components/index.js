"use strict";

module.exports = {
  plugins: ["stylelint-order"],
  processors: [
    [
      "stylelint-processor-styled-components",
      {
        ignoreFiles: ["**/*.css"],
      },
    ],
  ],
  extends: [
    "stylelint-config-recommended",
    "stylelint-config-idiomatic-css",
    "stylelint-config-prettier",
    "stylelint-config-styled-components",
  ],
  rules: {
    "declaration-no-important": true,
    "selector-type-no-unknown": [
      true,
      {
        ignore: ["custom-elements"],
      },
    ],
  },
};
