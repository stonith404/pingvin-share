import aw from "../utils/appwrite.util";

const createJWT = async () => {
  const jwt = (await aw.account.createJWT()).jwt;
  document.cookie = `aw_token=${jwt}; Max-Age=900; Path=/api`;
};

export default { createJWT };
