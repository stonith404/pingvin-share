import { createContext, useContext } from "react";
import { CurrentUser } from "../types/user.type";

export const UserContext = createContext<CurrentUser | null>(null);

const useUser = () => {
  return useContext(UserContext);
};

export default useUser;
