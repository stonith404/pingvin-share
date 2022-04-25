import sdk from "node-appwrite";
const aw = () => {
  let client = new sdk.Client();

  client
    .setEndpoint(process.env["APPWRITE_HOST"])
    .setProject("pingvin-share")
    .setKey(process.env["APPWRITE_API_KEY"])
    .setSelfSigned();

  const database = new sdk.Database(client);
  const storage = new sdk.Database(client);
  const functions = new sdk.Functions(client);

  return { database, storage, functions };
};

export default aw;
