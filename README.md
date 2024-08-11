# <div align="center"><img  src="https://user-images.githubusercontent.com/58886915/166198400-c2134044-1198-4647-a8b6-da9c4a204c68.svg" width="40"/> </br>Pingvin Share</div>

[![](https://dcbadge.limes.pink/api/server/wHRQ9nFRcK)](https://discord.gg/wHRQ9nFRcK) [![](https://img.shields.io/badge/Crowdin-2E3340.svg?style=for-the-badge&logo=Crowdin&logoColor=white)](https://crowdin.com/project/pingvin-share) [![](https://img.shields.io/badge/sponsor-30363D?style=for-the-badge&logo=GitHub-Sponsors&logoColor=#white)](https://github.com/sponsors/stonith404)

_Read this in another language: [Spanish](/docs/README.es.md), [English](/README.md), [简体中文](/docs/README.zh-cn.md), [日本語](/docs/README.ja-jp.md)_

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

### Installation with Docker (recommended)

1. Download the `docker-compose.yml` file
2. Run `docker compose up -d`

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
API_URL=http://localhost:8080 # Set the URL of the backend, default: http://localhost:8080
pm2 start --name="pingvin-share-frontend" .next/standalone/server.js
```

**Uploading Large Files**: By default, Pingvin Share uses a built-in reverse proxy to reduce the installation steps. However, this reverse proxy is not optimized for uploading large files. If you wish to upload larger files, you can either use the Docker installation or set up your own reverse proxy. An example configuration for Caddy can be found in `./Caddyfile`.

The website is now listening on `http://localhost:3000`, have fun with Pingvin Share 🐧!

### Integrations

#### ClamAV (Docker only)

ClamAV is used to scan shares for malicious files and remove them if found.

1. Add the ClamAV container to the Docker Compose stack (see `docker-compose.yml`) and start the container.
2. Docker will wait for ClamAV to start before starting Pingvin Share. This may take a minute or two.
3. The Pingvin Share logs should now log "ClamAV is active"

Please note that ClamAV needs a lot of [ressources](https://docs.clamav.net/manual/Installing/Docker.html#memory-ram-requirements).

#### OAuth 2 Login

View the [OAuth 2 guide](/docs/oauth2-guide.md) for more information.

### Additional resources

- [Synology NAS installation](https://mariushosting.com/how-to-install-pingvin-share-on-your-synology-nas/)
- [Zeabur installation](https://zeabur.com/templates/19G6OK)

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
2. Run the following commands:

   ```bash
   cd pingvin-share

   # Checkout the latest version
   git fetch --tags && git checkout $(git describe --tags `git rev-list --tags --max-count=1`)

   # Start the backend
   cd backend
   npm install
   npx prisma generate
   npm run build
   pm2 restart pingvin-share-backend

   # Start the frontend
   cd ../frontend
   npm install
   npm run build
   API_URL=http://localhost:8080 # Set the URL of the backend, default: http://localhost:8080
   pm2 restart pingvin-share-frontend
   ```

### Configuration

You can customize Pingvin Share like changing your domain by going to the configuration page in your admin dashboard `/admin/config`.

#### Environment variables

For installation specific configuration, you can use environment variables. The following variables are available:

##### Backend

| Variable         | Default Value                                      | Description                            |
| ---------------- | -------------------------------------------------- | -------------------------------------- |
| `PORT`           | `8080`                                             | The port on which the backend listens. |
| `DATABASE_URL`   | `file:../data/pingvin-share.db?connection_limit=1` | The URL of the SQLite database.        |
| `DATA_DIRECTORY` | `./data`                                           | The directory where data is stored.    |
| `CLAMAV_HOST`    | `127.0.0.1`                                        | The IP address of the ClamAV server.   |
| `CLAMAV_PORT`    | `3310`                                             | The port number of the ClamAV server.  |

##### Frontend

| Variable  | Default Value           | Description                              |
| --------- | ----------------------- | ---------------------------------------- |
| `PORT`    | `3000`                  | The port on which the frontend listens.  |
| `API_URL` | `http://localhost:8080` | The URL of the backend for the frontend. |

## 🖤 Contribute

### Translations

You can help to translate Pingvin Share into your language.
On [Crowdin](https://crowdin.com/project/pingvin-share) you can easily translate Pingvin Share online.

Is your language not on Crowdin? Feel free to [Request it](https://github.com/stonith404/pingvin-share/issues/new?assignees=&labels=language-request&projects=&template=language-request.yml&title=%F0%9F%8C%90+Language+request%3A+%3Clanguage+name+in+english%3E).

Any issues while translating? Feel free to participate in the [Localization discussion](https://github.com/stonith404/pingvin-share/discussions/198).

### Project

You're very welcome to contribute to Pingvin Share! Please follow the [contribution guide](/CONTRIBUTING.md) to get started.

## Sponsors
Thank you for supporting Pingvin Share 🙏
- [@COMPLEXWASTAKEN](https://github.com/COMPLEXWASTAKEN)