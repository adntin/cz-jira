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

// 获取issue
// https://github.com/floralvikings/jira-connector/blob/master/api/issue.js
// https://developer.atlassian.com/cloud/jira/platform/rest/v3/#api-rest-api-3-issue-issueIdOrKey-get
// jira.issue.getIssue({ issueKey: 'IPC-34' }, (error, issue) => {
//   if (error) {
//     console.log('fetch jira data error: ', error);
//   } else {
//     console.log('fetch jira data success: ', issue);
//   }
// });

// 添加comment
// https://github.com/floralvikings/jira-connector/blob/master/api/issue.js
// https://developer.atlassian.com/cloud/jira/platform/rest/v3/#api-rest-api-3-issue-issueIdOrKey-comment-post
jira.issue.addComment({ issueKey: 'SOFT-2244', comment: { body: new Date()}}, (error, comment) => {
    if (error) {
    console.log('set jira comment error: ', error);
  } else {
    console.log('set jira comment success: ', comment);
  }
});

console.log('ok');
