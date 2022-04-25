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
      deployment: "625db8ded97874b96590",
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
      name: "Clean Shares",
      runtime: "node-16.0",
      path: "functions/cleanShares",
      entrypoint: "src/index.js",
      execute: ["role:all"],
      events: [],
      schedule: "30,59 * * * *",
      timeout: 60,
    },
  ];
};
