const JiraConnector = require('jira-connector');

const jira = new JiraConnector({
  protocol: 'http',
  host: '192.168.6.107',
  port: 8080,
  basic_auth: {
    username: 'linbin',
    password: '20190410',
  },
});

jira.issue.getIssue({ issueKey: 'IPC-34' }, (error, issue) => {
  if (error) {
    console.log('fetch jira data error: ', error);
  } else {
    console.log('fetch jira data success: ', issue);
  }
});

console.log('ok');
