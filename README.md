### 本地调试

1. 在 cz-jira 仓库运行 npm link
2. 在 cz-management 仓库运行 npm link cz-jira
3. 在 cz-management 仓库运行 npm run commit

## tmpl 目录说明

把 tmpl 目录下的文件拷贝到应用程序(git-management 项目)根目录中

### 注意

1. cz.prompt(questions)是 Promise

### 发布 npm 包

- npm login
- npm publish

### 撤销 npm 包

- npm unpublish cz-jira@1.0.0

### 测试 jira 是否可获得数据

- node ./src/test.js