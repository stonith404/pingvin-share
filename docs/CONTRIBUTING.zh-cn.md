_选择合适的语言阅读: [西班牙语](/docs/CONTRIBUTING.es.md), [英语](/CONTRIBUTING.md), [简体中文](/docs/CONTRIBUTING.zh-cn.md)_

---

# 提交贡献

我们非常感谢你 ❤️ 为 Pingvin Share 提交贡献使其变得更棒! 欢迎任何形式的贡献，包括 issues, 建议, PRs 和其他形式

## 小小的开始

你找到了一个 bug，有新特性建议或者其他提议，请在 GitHub 建立一个 issue 以便我和你联络 😊

## 提交一个 Pull Request

在你提交 PR 前请确保

- PR 的名字遵守 [Conventional Commits specification](https://www.conventionalcommits.org):

  `<type>[optional scope]: <description>`

  例如:

  ```
  feat(share): add password protection
  ```

  `TYPE` 可以是:

  - **feat** - 这是一个新特性 feature
  - **doc** - 仅仅改变了文档部分 documentation
  - **fix** - 修复了一个 bug
  - **refactor** - 更新了代码，但是并非出于增加新特性 feature 或修复 bug 的目的

- 请在 PR 中附详细的解释说明
- 使用 `npm run format` 格式化你的代码

<details>
  <summary>不知道怎么发起一个 PR？ 点开了解怎么发起一个 PR </summary>

1. 点击 Pingvin Share 仓库的 `Fork` 按钮，复制一份你的仓库

2. 通过 `git clone` 将你的仓库克隆到本地

```
$ git clone https://github.com/[你的用户名]/pingvin-share
```

3. 进行你的修改 - 提交 commit 你的修改 - 重复直到完成

4. 将你的修改提交到 GitHub

```
$ git push origin [你的新分支的名字]
```

5. 提交你的代码以便代码审查

   如果你进入你 fork 的 Github 仓库，你会看到一个 `Compare & pull request` 按钮，点击该按钮

6. 发起一个 PR
7. 点击 `Create pull request` 来提交你的 PR
8. 等待代码审查，通过或以某些原因拒绝

</details>

## 配置开发项目

Pingvin Share 包括前端和后端部分

### 后端

后端使用 [Nest.js](https://nestjs.com) 建立，使用 Typescript

#### 搭建

1. 打开 `backend` 文件夹
2. 使用 `npm install` 安装依赖
3. 通过 `npx prisma db push` 配置数据库结构
4. 通过 `npx prisma db seed` 初始化数据库数据
5. 通过 `npm run dev` 启动后端

### 前端

后端使用 [Next.js](https://nextjs.org) 建立，使用 Typescript

#### 搭建

1. 首先启动后端
2. 打开 `frontend` 文件夹
3. 通过 `npm install` 安装依赖
4. 通过 `npm run dev` 启动前端

开发项目配置完成

### 测试

目前阶段我们只有后端的系统测试，在 `backend` 文件夹运行 `npm run test:system` 来执行系统测试
