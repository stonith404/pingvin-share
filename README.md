# <div align="center"><img  src="https://user-images.githubusercontent.com/58886915/166198400-c2134044-1198-4647-a8b6-da9c4a204c68.svg" width="40"/> </br>Pingvin Share</div>

---

_Read this in another language: [Spanish](/docs/README.es.md), [English](/README.md), [Simplified Chinese](/docs/README.zh-cn.md)_

---

Pingvin Share is self-hosted file sharing platform and an alternative for WeTransfer.

## ✨ Features

- Share files using a link
- Unlimited file size (restricted only by disk space)
- Set an expiration date for shares
- Secure shares with visitor limits and passwords
- Email recipients
- Integration with ClamAV for security scans

## 🐧 Get to know Pingvin Share

- [Demo](https://pingvin-share.dev.eliasschneider.com)
- [Review by DB Tech](https://www.youtube.com/watch?v=rWwNeZCOPJA)

<img src="https://user-images.githubusercontent.com/58886915/225038319-b2ef742c-3a74-4eb6-9689-4207a36842a4.png" width="700"/>

## ⌨️ Setup

> Note: Pingvin Share is in its early stages and may contain bugs.

### Deploy with Railway
Railway is a simple and powerful deployment platform, you can easily deploy your project using Dockerfile or setup commands.

> Railway provides **free plan** and this should cover the cost of Pingvin with limited usage.

**One-Click Deploy**

1. Click the **Deploy on Railway** button

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/Vsidvt?referralCode=NstqG_)

2. Connect Railway with your Github account, Railway will automatically clone a repo for deployment.

3. Wait 1-3 minutes for deployment, get a cup.

4. Railway generated a domain for you in deployments. Enjoy!

<details>
  <summary> Deploy Manually
  </summary>

1. Create a fork of the repository by clicking on the `Fork` button in the Pingvin Share repository

2. Go to [Railway Dashboard](https://railway.app/dashboard) and create a new project, connect with your Github if asked.

3. Deploy from Github repo. Select the repo you just forked! Then click **Deploy Now**

4. Go to `pingvin-share` production env setting, find `Environment - Domains`, click **Generate Domain** and enjoy!
</details>

5. (Optional) Add your custom domain by clicking **Custom Domain** in step 4.

### Installation with Docker (recommended)

1. Download the `docker-compose.yml` file
2. Run `docker-compose up -d`

The website is now listening on `http://localhost:3000`, have fun with Pingvin Share 🐧!

### Stand-alone Installation

Required tools:

- [Node.js](https://nodejs.org/en/download/) >= 16
- [Git](https://git-scm.com/downloads)
- [pm2](https://pm2.keymetrics.io/) for running Pingvin Share in the background

```bash
git clone https://github.com/stonith404/pingvin-share
cd pingvin-share

# Checkout the latest version
git fetch --tags && git checkout $(git describe --tags `git rev-list --tags --max-count=1`)

# Start the backend
cd backend
npm install
npm run build
pm2 start --name="pingvin-share-backend" npm -- run prod

# Start the frontend
cd ../frontend
npm install
npm run build
pm2 start --name="pingvin-share-frontend" npm -- run start
```

The website is now listening on `http://localhost:3000`, have fun with Pingvin Share 🐧!

### Integrations

#### ClamAV (Docker only)

ClamAV is used to scan shares for malicious files and remove them if found.

1. Add the ClamAV container to the Docker Compose stack (see `docker-compose.yml`) and start the container.
2. Docker will wait for ClamAV to start before starting Pingvin Share. This may take a minute or two.
3. The Pingvin Share logs should now log "ClamAV is active"

Please note that ClamAV needs a lot of [ressources](https://docs.clamav.net/manual/Installing/Docker.html#memory-ram-requirements).

### Additional resources

- [Synology NAS installation](https://mariushosting.com/how-to-install-pingvin-share-on-your-synology-nas/)

### Upgrade to a new version

As Pingvin Share is in early stage, see the release notes for breaking changes before upgrading.

#### Docker

```bash
docker compose pull
docker compose up -d
```

#### Stand-alone

1. Stop the running app
   ```bash
   pm2 stop pingvin-share-backend pingvin-share-frontend
   ```
2. Repeat the steps from the [installation guide](#stand-alone-installation) except the `git clone` step.

   ```bash
   cd pingvin-share

   # Checkout the latest version
   git fetch --tags && git checkout $(git describe --tags `git rev-list --tags --max-count=1`)

   # Start the backend
   cd backend
   npm run build
   pm2 restart pingvin-share-backend

   # Start the frontend
   cd ../frontend
   npm run build
   pm2 restart pingvin-share-frontend
   ```

### Custom branding

You can change the name and the logo of the app by visiting the admin configuration page.

## 🖤 Contribute

You're very welcome to contribute to Pingvin Share! Follow the [contribution guide](/CONTRIBUTING.md) to get started.
