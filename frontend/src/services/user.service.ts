import { CurrentUser } from "../types/user.type";
import api from "./api.service";
import authService from "./auth.service";

const getCurrentUser = async (): Promise<CurrentUser | null> => {
  try {
    await authService.refreshAccessToken();
    return (await api.get("users/me")).data;
  } catch {
    return null;
  }
};

export default {
  getCurrentUser,
};
