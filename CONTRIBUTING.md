# Contributing

We would ❤️ for you to contribute to Pingvin Share and help make it better! All contributions are welcome, including issues, suggestions, pull requests and more.

## Getting started
You've found a bug, have suggestion or something else, just create an issue on GitHub and we can get in touch 😊.


## Submit a Pull Request 
Once you created a issue and you want to create a pull request, follow this guide.

Branch naming convention is as following

`TYPE-ISSUE_ID-DESCRIPTION`

example:

```
feat-69-ability-to-set-share-expiration-to-never
```

When `TYPE` can be:

- **feat** - is a new feature
- **doc** - documentation only changes
- **fix** - a bug fix
- **refactor** - code change that neither fixes a bug nor adds a feature

**All PRs must include a commit message with the changes description!**

For the initial start, fork the project and use the `git clone` command to download the repository to your computer. A standard procedure for working on an issue would be to:

1. `git pull`, before creating a new branch, pull the changes from upstream. Your master needs to be up to date.

```
$ git pull
```

2. Create new branch from `main` like: `feat-69-ability-to-set-share-expiration-to-never`<br/>

```
$ git checkout -b [name_of_your_new_branch]
```

3. Work - commit - repeat

4. Before you push your changes, make sure you run the linter and format the code.

```bash
npm run lint
npm run format
```

5. Push changes to GitHub

```
$ git push origin [name_of_your_new_branch]
```

6. Submit your changes for review
   If you go to your repository on GitHub, you'll see a `Compare & pull request` button. Click on that button.
7. Start a Pull Request
   Now submit the pull request and click on `Create pull request`.
8. Get a code review approval/reject

## Setup project

Pingvin Share consists of a frontend and a backend.

### Backend

The backend is built with [Nest.js](https://nestjs.com) and uses Typescript.

#### Setup

1. Open the `backend` folder
2. Duplicate the `.env.example` file, rename the duplicate to `.env` and change the environment variables if needed
3. Install the dependencies with `npm install`
4. Push the database schema to the database by running `npx prisma db push`
5. Start the backend with `npm run dev`

### Frontend
The frontend is built with [Next.js](https://nextjs.org) and uses Typescript.

#### Setup
1. Start the backend first
2. Open the `frontend` folder
3. Duplicate the `.env.example` file, rename the duplicate to `.env` and change the environment variables if needed
4. Install the dependencies with `npm install`
5. Start the frontend with `npm run dev`

You're all set!

### Testing

At the moment we only have system tests for the backend. To run these tests, run `npm run test:system` in the backend folder.
