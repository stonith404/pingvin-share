import axios from "axios";

const api = () =>
  axios.create({
    baseURL: process.env["NEXT_PUBLIC_APPWRITE_HOST"],
    headers: {
      cookie: `a_session_console=${process.env["APPWRITE_USER_TOKEN"]}`,
    },
  });

export default api;
