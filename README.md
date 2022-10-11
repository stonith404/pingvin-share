# <div align="center"><img  src="https://user-images.githubusercontent.com/58886915/166198400-c2134044-1198-4647-a8b6-da9c4a204c68.svg" width="40"/> </br>Pingvin Share</div>

Pingvin Share is self-hosted file sharing platform and an alternative for WeTransfer.

## 🎪 Showcase

Demo: https://pingvin-share.dev.eliasschneider.com

<img src="https://user-images.githubusercontent.com/58886915/167101708-b85032ad-f5b1-480a-b8d7-ec0096ea2a43.png" width="700"/>

## ✨ Features

- Create a simple share with a link
- No file size limit, only your disk will be your limit
- Optionally secure your share with a visitor limit and a password
- Dark mode

## ⌨️ Setup

1. Download the `docker-compose.yml` and `.env.example` file.
2. Rename the `.env.example` file to `.env` and change the environment variables so that they fit to your environment. If you need help with the environment variables take a look [here](#environment-variables)
3. Run `docker-compose up -d`

The website is now listening available on `http://localhost:3000`, have fun with Pingvin Share 🐧!

### Environment variables

| Variable             | Description                                                                                                           | Possible values |
| -------------------- | --------------------------------------------------------------------------------------------------------------------- | --------------- |
| `APP_URL`            | On which URL Pingvin Share is available. E.g http://localhost or https://pingvin-share.com.                           | URL             |
| `BACKEND_URL`        | Where the backend is listening on your local machine. If you use the default installation, use `http://backend:8080`. | URL             |
| `SHOW_HOME_PAGE`     | Whether the Pingvin Share home page should be shown.                                                                   | true/false      |
| `ALLOW_REGISTRATION` | Whether a new user can create a new account.                                                                           | true/false      |
| `MAX_FILE_SIZE`      | Maximum allowed size per file in bytes.                                                                               | Number          |
| `JWT_SECRET`         | Random string to sign the JWT's.                                                                                      | Long random string   |

## 🖤 Contribute

You're very welcome to contribute to Pingvin Share!
Contact me, create an issue or directly create a pull request.

### Development setup

#### Database & Backend

1. Open the `backend` folder
2. Duplicate the `.env.example` file, rename the duplicate to `.env` and change the environment variables if needed
3. Install the dependencies with `npm install`
4. Start the database by running `docker-compose up -d`
5. Push the database schema to the database by running `npx prisma db push`
6. Start the backend with `npm run dev`

#### Frontend

1. Open the `frontend` folder
2. Duplicate the `.env.example` file, rename the duplicate to `.env` and change the environment variables if needed
3. Install the dependencies with `npm install`
4. Start the frontend with `npm run dev`

You're all set!
