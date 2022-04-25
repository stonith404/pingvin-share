const sdk = require("node-appwrite")

module.exports = async function (req, res) {
  const client = new sdk.Client();

  let database = new sdk.Database(client);

  client
    .setEndpoint(req.env["APPWRITE_FUNCTION_ENDPOINT"])
    .setProject(req.env["APPWRITE_FUNCTION_PROJECT_ID"])
    .setKey(req.env["APPWRITE_FUNCTION_API_KEY"])
    .setSelfSigned(true);


  const payload = JSON.parse(req.payload);
  database.updateDocument("shares", payload.id, {
    enabled: true
  })
  res.json({
    id: payload.id,
  });
};
