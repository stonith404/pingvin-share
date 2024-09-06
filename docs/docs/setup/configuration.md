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

| Variable         | Default Value                                      | Description                            |
| ---------------- | -------------------------------------------------- | -------------------------------------- |
| `PORT`           | `8080`                                             | The port on which the backend listens. |
| `DATABASE_URL`   | `file:../data/pingvin-share.db?connection_limit=1` | The URL of the SQLite database.        |
| `DATA_DIRECTORY` | `./data`                                           | The directory where data is stored.    |
| `CLAMAV_HOST`    | `127.0.0.1`                                        | The IP address of the ClamAV server.   |
| `CLAMAV_PORT`    | `3310`                                             | The port number of the ClamAV server.  |

#### Frontend

| Variable  | Default Value           | Description                              |
| --------- | ----------------------- | ---------------------------------------- |
| `PORT`    | `3000`                  | The port on which the frontend listens.  |
| `API_URL` | `http://localhost:8080` | The URL of the backend for the frontend. |
