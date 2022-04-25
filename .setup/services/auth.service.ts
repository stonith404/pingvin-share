import api from "./api.service";
import rl from "readline-sync";
import cookie from "cookie";

const getToken = async () => {
  var email = rl.question("Email: ");
  var password = rl.question("Password: ", {
    hideEchoBack: true,
  });

  const credentials = await api().post("/account/sessions", {
    email,
    password,
  });

  return cookie.parse(credentials.headers["set-cookie"].toString())
    .a_session_console_legacy;
};

const generateApiKey = async () => {
  const res = await api().post("/projects/pingvin-share/keys", {
    name: "Setup key",
    scopes: [
      "collections.read",
      "collections.write",
      "attributes.read",
      "attributes.write",
      "indexes.read",
      "indexes.write",
      "documents.read",
      "documents.write",
      "functions.read",
      "functions.write",
      "execution.read",
      "execution.write",
    ],
  });
  return res.data.secret;
};

export default {
  getToken,
  generateApiKey,
};
