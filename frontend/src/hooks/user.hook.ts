import { createContext, useContext } from "react";
import { UserHook } from "../types/user.type";

export const UserContext = createContext<UserHook>({
  user: null,
  refreshUser: async () => null,
});

const useUser = () => {
  return useContext(UserContext);
};

export default useUser;
