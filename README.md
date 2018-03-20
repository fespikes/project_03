# Tcc Frontend
这是 Transwarp cloud eco/TDC运维平台 项目的前端repo。

### Dev

```bash
npm install # or yarn install
npm start
```

### Unit test

```bash
npm test
```

### Scripts

```bash
# 编译国际化文本
npm run i18n
```

### Collaboration

***must do***

1. 提交合并前，务必检查lint没有抛错，UT都能跑过。关于lint，可以安装编辑器lint插件，如vscode的tslint。也可以提交前跑`npm run lint`来检查lint错误。
2. 请检查编辑器是否加载了editorconfig里面的配置

***nice to have***

遵照[karma commit rule](http://karma-runner.github.io/0.10/dev/git-commit-msg.html)来描述commit。

#### 模块定义

- shared
模块间公用组件或服务
- gallery
开发调试模块
- 其他模块. 应以合理逻辑进行归类

### Release

```bash
npm run build:prod
```

### 制作CI build image

当node依赖更新时，需重新制作image。在项目根目录下运行

```
docker build . -f ci/Dockerfile -t tcc/tdc-eco-ci
docker tag tcc/tdc-eco-ci 172.16.1.99/frontend/tdc-eco-frontend/build/tdc-eco-ci:latest
docker push 172.16.1.99/frontend/tdc-eco-frontend/build/tdc-eco-ci:latest
```

### 得到最新的artifacts

对于master分支，可由以下链接得到最新的artifacts，即`npm run build:prod`得到的文件。
```
http://172.16.1.41:10080/TDC/tdc-eco-frontend/-/jobs/artifacts/master/download?job=postcommit
```
