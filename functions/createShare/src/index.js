const sdk = require("node-appwrite")
const util = require("./util")

module.exports = async function (req, res) {
  const client = new sdk.Client();

  // You can remove services you don't use
  let database = new sdk.Database(client);
  let storage = new sdk.Storage(client);

  client
    .setEndpoint(req.env["APPWRITE_FUNCTION_ENDPOINT"])
    .setProject(req.env["APPWRITE_FUNCTION_PROJECT_ID"])
    .setKey(req.env["APPWRITE_FUNCTION_API_KEY"])
    .setSelfSigned(true);

  // Payload (HTTP body) that was sent
  const payload = JSON.parse(req.payload);

  // User Id from the user which created a share
  const userId = req.env["APPWRITE_FUNCTION_USER_ID"];

  let securityDocumentId;

  // If a security property was given create a document in the Share Security collection
  if (Object.getOwnPropertyNames(payload.security).length != 0) {
    securityDocumentId = (
      await database.createDocument(
        "shareSecurity",
        "unique()",
        { maxVisitors: payload.security.maxVisitors, password: payload.security.password ? util.hashPassword(payload.security.password, payload.id) : undefined, },
        []
      )
    ).$id;
  }

  // Create the storage bucket
  await storage.createBucket(
    payload.id,
    `Share-${payload.id}`,
    "bucket",
    ["role:all"],
    [`user:${userId}`],
  )

  const expiration = Date.now() + (payload.expiration * 60 * 1000)

  // Create document in Shares collection
  await database.createDocument("shares", payload.id, {
    securityID: securityDocumentId,
    createdAt: Date.now(),
    expiresAt: expiration,
  });

  res.json({
    id: payload.id,
  });
};
