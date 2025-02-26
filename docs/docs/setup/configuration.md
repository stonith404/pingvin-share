---
id: configuration
---

# Configuration

## General configuration

There are plenty of settings you can adjust to your needs. Pingvin Share can be configured in two ways:

### UI

You can change the settings in the UI (`/admin/config`)

### YAML file

You can set the configuration via a YAML file. If you choose this way, you won't be able to change the settings in the UI.

If you use Docker you can create a `config.yml` file based on the [`config.example.yaml`](https://github.com/stonith404/pingvin-share/blob/main/config.yaml) and mount it to `/opt/app/config.yaml` in the container.

If you run Pingvin Share without Docker, you can create a `config.yml` file based on the [`config.example.yaml`](https://github.com/stonith404/pingvin-share/blob/main/config.yaml) in the root directory of the project.

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

| Variable          | Default Value | Description                                                                                                                                                                                                                                                                                                                                                                   |
| ----------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `TRUST_PROXY`     | `false`       | Whether Pingvin Share is behind a reverse proxy. If set to `true`, the `X-Forwarded-For` header is trusted.                                                                                                                                                                                                                                                                   |
| `PUID` and `PGID` | `1000`        | The user and group ID of the user who should run Pingvin Share inside the Docker container and owns the files that are mounted with the volume. You can get the `PUID` and `GUID` of your user on your host machine by using the command `id`. For more information see [this article](https://docs.linuxserver.io/general/understanding-puid-and-pgid/#using-the-variables). |
