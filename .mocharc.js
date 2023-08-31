'use strict';

const config = {
  color: true,
  parallel: true,
  recursive: true,
  extension: ["js", "ts"],
  require: "ts-node/register/transpile-only,./test/setup",
};

require('chai').use(require('chai-as-promised'));

module.exports = config;
