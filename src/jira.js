const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const findConfig = require("find-config");
const JiraConnector = require("jira-connector");
const gitBranch = require("git-branch");
const config = require("./getConfig");

const JIRA_ACCOUNT_FILE_NAME = "jira.config.json";
const { protocol, host, port, prefix } = config;

// /Users/devin.lin/Desktop/git-management/package.json
const pkg = findConfig("package.json", { home: false });
const pkgDir = path.dirname(pkg);
const filePath = path.resolve(pkgDir, JIRA_ACCOUNT_FILE_NAME); // absolute path

const getJiraAccount = () => {
  if (fs.existsSync(filePath)) {
    const json = require(filePath); // json code
    // const strBase64 = fs.readFileSync(filePath, "utf8"); // base 64 string
    json.password = Buffer.from(json.password, "base64").toString();
    return json;
  }
  return null;
};

// {"username": "", "password": ""}
const setJiraAccount = json => {
  const account = { ...json }; // clone object data
  account.password = Buffer.from(account.password).toString("base64");
  fs.writeFileSync(filePath, JSON.stringify(account));
  console.log(chalk.green("\nThe JIRA account was successfully saved!\n"));
};

const removeJiraAccount = () => {
  fs.unlinkSync(filePath);
};

const getIssueInfo = async ({ username, password }) => {
  const branchName = gitBranch.sync(); // feature/FIJI-1000 || master
  const ticket = branchName.split("/").pop(); // FIJI-1000
  const regExp = new RegExp(`^${prefix}-\\d+$`, 'g');
  // The current "master" branch cannot fetch Jira information.
  if (!regExp.test(ticket)) {
    const errors = [
      `git branch name: ${branchName}`,
      `ticket: ${ticket}`,
      `prefix: ${prefix}`,
      `The current "${branchName}" branch cannot fetch Jira information.`,
      "You need to fill it out manually."
    ];
    throw errors.join("\n");
  }
  try {
    const params = {
      protocol,
      port,
      host: host || "jira.ringcentral.com",
      basic_auth: { username, password }
    };
    const jira = new JiraConnector(params);
    // console.log('host:', host);
    let summary = await new Promise((resolve, reject) =>
      jira.issue.getIssue({ issueKey: ticket }, (error, issue) => {
        if (error) {
          console.log('Fetch issue info error:', params);
          reject(error);
        } else {
          resolve(issue.fields.summary);
        }
      })
    );
    return { ticket, summary };
  } catch (err) {
    throw new Error("Unable to connect to Jira.", err);
  }
};

module.exports = {
  getJiraAccount,
  setJiraAccount,
  removeJiraAccount,
  getIssueInfo
};
