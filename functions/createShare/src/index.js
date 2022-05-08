const sdk = require("node-appwrite")
const util = require("./util")

module.exports = async function (req, res) {
  const client = new sdk.Client();

  let database = new sdk.Database(client);
  let users = new sdk.Users(client);
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

  let userIds;
  if (payload.emails.length > 0) {
    const creatorEmail = (await users.get(userId)).email
    userIds = []
    userIds.push(userId)
    for (const email of payload.emails) {
      userIds.push((await users.list(`email='${email}'`)).users[0].$id)
      util.sendMail(email, creatorEmail, payload.id)
    }

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
    users: userIds,
    createdAt: Date.now(),
    expiresAt: expiration,
  });

  res.json({
    id: payload.id,
  });
};
