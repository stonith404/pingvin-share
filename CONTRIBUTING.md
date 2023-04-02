*Read this in another language: [Spanish](CONTRIBUTING.es.md), [English](CONTRIBUTING.md), [Simplified Chinese](CONTRIBUTING.zh-cn.md)* 

---

# Contributing

We would ❤️ for you to contribute to Pingvin Share and help make it better! All contributions are welcome, including issues, suggestions, pull requests and more.

## Getting started

You've found a bug, have suggestion or something else, just create an issue on GitHub and we can get in touch 😊.

## Submit a Pull Request

Before you submit the pull request for review please ensure that

- The pull request naming follows the [Conventional Commits specification](https://www.conventionalcommits.org):

  `<type>[optional scope]: <description>`

  example:

  ```
  feat(share): add password protection
  ```

  When `TYPE` can be:

  - **feat** - is a new feature
  - **doc** - documentation only changes
  - **fix** - a bug fix
  - **refactor** - code change that neither fixes a bug nor adds a feature

- Your pull request has a detailed description
- You run `npm run format` to format the code

<details>
  <summary>Don't know how to create a pull request? Learn how to create a pull request</summary>

1. Create a fork of the repository by clicking on the `Fork` button in the Pingvin Share repository

2. Clone your fork to your machine with `git clone`

```
$ git clone https://github.com/[your_username]/pingvin-share
```

3. Work - commit - repeat

4. Push changes to GitHub

```
$ git push origin [name_of_your_new_branch]
```

5. Submit your changes for review
   If you go to your repository on GitHub, you'll see a `Compare & pull request` button. Click on that button.
6. Start a Pull Request
7. Now submit the pull request and click on `Create pull request`.
8. Get a code review approval/reject

</details>

## Setup project

Pingvin Share consists of a frontend and a backend.

### Backend

The backend is built with [Nest.js](https://nestjs.com) and uses Typescript.

#### Setup

1. Open the `backend` folder
2. Install the dependencies with `npm install`
3. Push the database schema to the database by running `npx prisma db push`
4. Seed the database with `npx prisma db seed`
5. Start the backend with `npm run dev`

### Frontend

The frontend is built with [Next.js](https://nextjs.org) and uses Typescript.

#### Setup

1. Start the backend first
2. Open the `frontend` folder
3. Install the dependencies with `npm install`
4. Start the frontend with `npm run dev`

You're all set!

### Testing

At the moment we only have system tests for the backend. To run these tests, run `npm run test:system` in the backend folder.
