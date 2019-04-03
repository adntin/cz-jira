const chalk = require("chalk");
const findConfig = require("find-config");

const CONFIG_FILE_NAME = ".cz-jira.js";
let json = findConfig.require(CONFIG_FILE_NAME, { home: false });
if (!json) {
  throw new Error(chalk.red("The '.cz-jira.js' file does not exist.\n"));
}

module.exports = json;
