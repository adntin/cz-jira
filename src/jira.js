const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const findConfig = require("find-config");
const JiraConnector = require("jira-connector");
const gitBranch = require("git-branch");
const config = require("./getConfig");

const JIRA_ACCOUNT_FILE_NAME = "jira.config.json";

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
  json.password = Buffer.from(json.password).toString("base64");
  fs.writeFileSync(filePath, JSON.stringify(json));
  console.log(chalk.green("\nThe JIRA account was successfully saved!\n"));
};

const removeJiraAccount = () => {
  fs.unlinkSync(filePath);
};

const getIssueInfo = async ({ username, password }) => {
  const jira = new JiraConnector({
    host: config.host || "jira.ringcentral.com",
    basic_auth: { username, password }
  });
  const branchName = gitBranch.sync(); // feature/FIJI-1000 || master
  const ticket = branchName.split("/").pop(); // FIJI-1000
  // The current "master" branch cannot fetch Jira information.
  if (!ticket.match(/^FIJI-\d+$/)) {
    const errors = [
      `The current "${branchName}" branch cannot fetch Jira information.`,
      "You need to fill it out manually."
    ];
    throw errors.join("\n");
  }
  try {
    let summary = await new Promise((resolve, reject) =>
      jira.issue.getIssue({ issueKey: ticket }, (error, issue) => {
        if (error) {
          reject(error);
        } else {
          resolve(issue.fields.summary);
        }
      })
    );
    return { ticket, summary };
  } catch (err) {
    throw new Error("Unable to connect to Jira.");
  }
};

module.exports = {
  getJiraAccount,
  setJiraAccount,
  removeJiraAccount,
  getIssueInfo
};
