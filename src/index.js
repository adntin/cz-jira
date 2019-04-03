const chalk = require("chalk");
const {
  getJiraAccount,
  setJiraAccount,
  removeJiraAccount,
  getIssueInfo
} = require("./jira");
const { getJiraQuestions, getCommitQuestions } = require("./questions");
const buildCommit = require("./buildCommit");

const commitizenHandler = async (cz, commit, questions) => {
  const json = await cz.prompt(questions); // { type: 'feat', title: 'FIJI-2000', summary: 'SUMMARY', desc: 'DESC' }
  const message = buildCommit(json);
  commit(message);
};

const commitHandler = async (cz, commit, account) => {
  try {
    // success fetch jira information
    const issueInfo = await getIssueInfo(account);
    const questions = getCommitQuestions(issueInfo); // Automatically fill, set default value
    await commitizenHandler(cz, commit, questions);
  } catch (error) {
    // failure fetch jira information
    console.log(chalk.red(error) + "\n");
    const questions = getCommitQuestions({}); // Manually fill
    await commitizenHandler(cz, commit, questions);
  }
};

// Note: You cannot use the async function
const _prompter = async (cz, commit) => {
  const account = getJiraAccount(); // {"username": "", "password": ""}
  if (account) {
    await commitHandler(cz, commit, account);
    return;
  }
  try {
    console.log(chalk.green("Your are first time connect to JIRA.\n"));
    const questions = getJiraQuestions(); // array[object]
    const json = await cz.prompt(questions); // {"username": "", "password": ""}
    const account = setJiraAccount(json);
    await commitHandler(cz, commit, account);
  } catch (error) {
    console.log(chalk.red(error));
    removeJiraAccount();
  }
};

const prompter = (cz, commit) => {
  _prompter(cz, commit);
};

module.exports = {
  prompter
};
