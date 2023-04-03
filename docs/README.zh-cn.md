# <div align="center"><img  src="https://user-images.githubusercontent.com/58886915/166198400-c2134044-1198-4647-a8b6-da9c4a204c68.svg" width="40"/> </br>Pingvin Share</div>

---

_选择合适的语言阅读: [西班牙语](/docs/README.es.md), [英语](/README.md), [简体中文](/docs/README.zh-cn.md)_

---

Pingvin Share 是一个可自建的文件分享平台，是 WeTransfer 的一个替代品

## ✨ 特性

- 通过可自定义后缀的链接分享文件
- 可自定义任意大小的文件上传限制 (受制于托管所在的硬盘大小)
- 对共享链接设置有效期限
- 对共享链接设置访问次数和访问密码
- 通过邮件自动发送共享链接
- 整合 ClamAV 进行反病毒检查

## 🐧 了解一下 Pingvin Share

- [示例网站](https://pingvin-share.dev.eliasschneider.com)
- [DB Tech 推荐视频](https://www.youtube.com/watch?v=rWwNeZCOPJA)

<img src="https://user-images.githubusercontent.com/58886915/225038319-b2ef742c-3a74-4eb6-9689-4207a36842a4.png" width="700"/>

## ⌨️ 自建指南

> 注意：Pingvin Share 仍处于开发阶段并且可能存在 bugs

### Railway 部署

Railway 是一个简单而强大的部署平台，你可以轻松地使用 Dockerfile 或项目启动代码进行部署

> Railway 提供免费的计划，并且在合理使用下能覆盖 Pingvin 的部署费用

**一键部署**

1. 点击下方的 **Deploy on Railway** 按钮

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/Vsidvt?referralCode=NstqG_)

2. 授权 Railway 访问你的 Github 账户，Railway 会自动克隆一份仓库用于部署
3. 部署时等待 1-3 分钟，休息一下吧
4. Railway 会自动为你的部署生成域名，开始使用吧！

<details>
  <summary> 手动部署
  </summary>

1. 点击 Pingvin Share 仓库的 Fork 按钮，创建一个你的仓库分支

2. 前往 [Railway Dashboard](https://railway.app/dashboard) 新建一个项目，如果提示则授权 Railway 访问你的 Github 账户

3. 选择项目的 Github 仓库，选择你刚才创建的 Fork 分支仓库，点击 **Deploy Now**

4. 前往 `pingvin-share` 生产环境的设置页面，找到 `Environment - Domains`，点击 **Generate Domain** 生成域名并开始使用吧！

5. (可选) 点击步骤 4 中的 **Custom Domain** 绑定自定义域名
</details>
### Docker 部署 (推荐)

1. 下载 `docker-compose.yml`
2. 运行命令 `docker-compose up -d`

现在网站运行在 `http://localhost:3000`，尝试一下你本地的 Pingvin Share 🐧!

### Stand-alone 部署

必须的依赖:

- [Node.js](https://nodejs.org/en/download/) >= 16
- [Git](https://git-scm.com/downloads)
- [pm2](https://pm2.keymetrics.io/) 用于后台运行 Pingvin Share

```bash
git clone https://github.com/stonith404/pingvin-share
cd pingvin-share

# 获取最新的版本
git fetch --tags && git checkout $(git describe --tags `git rev-list --tags --max-count=1`)

# 启动后端 backend
cd backend
npm install
npm run build
pm2 start --name="pingvin-share-backend" npm -- run prod

# 启动前端 frontend
cd ../frontend
npm install
npm run build
pm2 start --name="pingvin-share-frontend" npm -- run start
```

现在网站运行在 `http://localhost:3000`，尝试一下你本地的 Pingvin Share 🐧!

### 整合组件

#### ClamAV (仅限 Docker 部署)

扫描上传文件中是否存在可疑文件，如果存在 ClamAV 会自动移除

1. 在 docker-compose 配置中添加 ClamAV 容器 (见 `docker-compose.yml` 注释部分) 并启动容器
2. Docker 会在启动 Pingvin Share 前启动 ClamAV，也许会花费 1-2 分钟
3. Pingvin Share 日志中应该有 "ClamAV is active"

请注意 ClamAV 会消耗很多 [系统资源(特别是内存)](https://docs.clamav.net/manual/Installing/Docker.html#memory-ram-requirements)

### 更多资源

- [群晖 NAS 配置](https://mariushosting.com/how-to-install-pingvin-share-on-your-synology-nas/)

### 升级

因为 Pingvin Share 仍处在开发阶段，在升级前请务必阅读 release notes 避免不可逆的改变

#### Docker 升级

```bash
docker compose pull
docker compose up -d
```

#### Stand-alone 升级

1. 停止正在运行的 app
   ```bash
   pm2 stop pingvin-share-backend pingvin-share-frontend
   ```
2. 重复 [installation guide](#stand-alone-installation) 中的步骤，除了 `git clone` 这一步

   ```bash
   cd pingvin-share

   # 获取最新的版本
   git fetch --tags && git checkout $(git describe --tags `git rev-list --tags --max-count=1`)

   # 启动后端 backend
   cd backend
   npm run build
   pm2 restart pingvin-share-backend

   # 启动前端 frontend
   cd ../frontend
   npm run build
   pm2 restart pingvin-share-frontend
   ```

### 自定义品牌

你可以在管理员配置页面改变网站的名字和 logo

## 🖤 提交贡献

非常欢迎向 Pingvin Share 提交贡献! 请阅读 [contribution guide](/CONTRIBUTING.md) 来提交你的贡献
