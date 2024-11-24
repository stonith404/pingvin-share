---
id: configuration
---

# Configuration

You can customize Pingvin Share by going to the configuration page in your admin dashboard `/admin/config`.

## General

The **General** Tab will let you customize your Pingvin Share instance to your liking.

### App name

To change the name of your instance, insert any text into `App name`.

### App URL

To make your App available trough your own **domain**, insert your specific domain and also subdomain if needed. Add an `https://` if you have an SSL certificate installed. If this is not the case, use `http://`.

### Show home page

If you don't like the **home page** Pingvin Share provides and you just want the upload tab to be the main page, toggle this to `true`.

### Logo

Not only you can change your instances name, but also the logo it shows everywhere. To do that, upload an image as `png` with a 1:1 aspect ratio.

---

### Environment variables

For installation specific configuration, you can use environment variables. The following variables are available:

#### Backend

| Variable         | Default Value                                      | Description                                                                                              |
| ---------------- | -------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `BACKEND_PORT`   | `8080`                                             | The port on which the backend listens.                                                                   |
| `DATABASE_URL`   | `file:../data/pingvin-share.db?connection_limit=1` | The URL of the SQLite database.                                                                          |
| `DATA_DIRECTORY` | `./data`                                           | The directory where data is stored.                                                                      |
| `CLAMAV_HOST`    | `127.0.0.1` or `clamav` when running with Docker   | The IP address of the ClamAV server. See the [ClamAV docs](integrations.md#clamav) for more information. |
| `CLAMAV_PORT`    | `3310`                                             | The port number of the ClamAV server.                                                                    |

#### Frontend

| Variable  | Default Value           | Description                              |
| --------- | ----------------------- | ---------------------------------------- |
| `PORT`    | `3000`                  | The port on which the frontend listens.  |
| `API_URL` | `http://localhost:8080` | The URL of the backend for the frontend. |

#### Docker specific
Environment variables that are only available when running Pingvin Share with Docker.

| Variable      | Default Value | Description                                                                                                 |
| ------------- | ------------- | ----------------------------------------------------------------------------------------------------------- |
| `TRUST_PROXY` | `false`       | Whether Pingvin Share is behind a reverse proxy. If set to `true`, the `X-Forwarded-For` header is trusted. |
| `PUID` and `PGID` | `1000`       |  The user and group ID of the user who should run Pingvin Share inside the Docker container and owns the files that are mounted with the volume. You can get the `PUID` and `GUID` of your user on your host machine by using the command `id`. For more information see [this article](https://docs.linuxserver.io/general/understanding-puid-and-pgid/#using-the-variables). |
