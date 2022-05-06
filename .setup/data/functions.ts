export default () => {
  const host = process.env["APPWRITE_HOST"].replace(
    "localhost",
    "host.docker.internal"
  );
  return [
    {
      $id: "createShare",
      execute: ["role:all"],
      name: "Create Share",
      runtime: "node-16.0",
      vars: {
        APPWRITE_FUNCTION_ENDPOINT: host,
        APPWRITE_FUNCTION_API_KEY: process.env["APPWRITE_FUNCTION_API_KEY"],
        SMTP_HOST: "",
        SMTP_PORT: "",
        SMTP_USER: "",
        SMTP_PASSWORD: "",
        SMTP_FROM: "",
        FRONTEND_URL: "",
      },
      events: [],
      schedule: "",
      timeout: 15,
    },
    {
      $id: "finishShare",
      execute: ["role:all"],
      name: "Finish Share",
      runtime: "node-16.0",
      vars: {
        APPWRITE_FUNCTION_ENDPOINT: host,
        APPWRITE_FUNCTION_API_KEY: process.env["APPWRITE_FUNCTION_API_KEY"],
      },
      events: [],
      schedule: "",
      timeout: 15,
    },
    {
      $id: "cleanShares",
      execute: [],
      name: "Clean Shares",
      runtime: "node-16.0",
      vars: {
        APPWRITE_FUNCTION_ENDPOINT: host,
        APPWRITE_FUNCTION_API_KEY: process.env["APPWRITE_FUNCTION_API_KEY"],
      },
      events: [],
      schedule: "30,59 * * * *",
      timeout: 60,
    },
  ];
};
