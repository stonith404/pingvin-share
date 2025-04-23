---
id: installation
---

# Installation

### Installation with Docker (recommended)

1. Download the `docker-compose.yml` file
2. Run `docker compose up -d`

The website is now listening on `http://localhost:3000`, have fun with Pingvin Share 🐧!

### Installation with Portainer

1. In the **Stacks** menu, click the **Add stack** button
2. Give you stack a name (ex. pingvinshare)
3. In the web editor, paste the content of the [docker-compose](https://github.com/stonith404/pingvin-share/blob/main/docker-compose.yml) file.
4. Edit the external port and the environment variables (optional).
5. Click on **Deploy the stack**.

Your container is now listening on `http://localhost:<externalport>`, have fun with Pingvin Share 🐧!

### Stand-alone Installation

Required tools:

- [Node.js](https://nodejs.org/en/download/) >= 22
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

# Start the frontend
cd ../frontend
npm install
npm run build
API_URL=http://localhost:8080 # Set the URL of the backend, default: http://localhost:8080
pm2 start npm --name "pingvin-share-frontend" -- run start
```

**Uploading Large Files**: By default, Pingvin Share uses a built-in reverse proxy to reduce the installation steps. However, this reverse proxy is not optimized for uploading large files. If you wish to upload larger files, you can either use the Docker installation or set up your own reverse proxy. An example configuration for Caddy can be found in `./reverse-proxy/Caddyfile`.

The website is now listening on `http://localhost:3000`, have fun with Pingvin Share 🐧!
