const sdk = require("node-appwrite")

module.exports = async function (req, res) {
  const client = new sdk.Client();

  let database = new sdk.Database(client);

  let storage = new sdk.Storage(client);

  client
    .setEndpoint(req.env["APPWRITE_FUNCTION_ENDPOINT"])
    .setProject(req.env["APPWRITE_FUNCTION_PROJECT_ID"])
    .setKey(req.env["APPWRITE_FUNCTION_API_KEY"])
    .setSelfSigned(true);



  const deletedShares = (await database.listDocuments("shares", [sdk.Query.lesser("expiresAt",Date.now())],
    100)).documents;
  console.log(deletedShares)
  for (const share of deletedShares) {
    database.deleteDocument("shares", share.$id)
    if (share.securityID != null) {
      database.deleteDocument("shareSecurity", share.securityID)
    }
    storage.deleteBucket(share.$id)
    console.log("deleted" + share.$id)
  }

  res.json({
    status: "done"
  });




};


