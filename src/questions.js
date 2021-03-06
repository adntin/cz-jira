const config = require("./getConfig");

const getJiraQuestions = () => {
  return [
    {
      type: "input",
      name: "username",
      message: "[JIRA] Please enter your user name?",
      validate: function(value) {
        return !!value;
      },
      when: true
    },
    {
      type: "password",
      name: "password",
      message: "[JIRA] Please enter your password?",
      validate: function(value) {
        return !!value;
      }
    }
  ];
};

const getCommitQuestions = ({ ticket, summary }) => {
  return [
    {
      type: "list",
      name: "type",
      message: "Select the type of change that you're committing:",
      choices: config.types
    },
    {
      type: "input",
      name: "title",
      message: `Please input your ticket number:`,
      default: ticket,
      validate: function(value) {
        return !!value;
      }
    },
    {
      type: "input",
      name: "summary",
      message: `Please input the ticket summary:`,
      default: summary,
      validate: function(value) {
        return !!value;
      }
    },
    {
      type: "input",
      name: "desc",
      message: `What is your change?`,
      validate: function(value) {
        return !!value;
      },
      filter: function(value) {
        return value.charAt(0).toLowerCase() + value.slice(1);
      }
    }
  ];
};

module.exports = { getJiraQuestions, getCommitQuestions };
