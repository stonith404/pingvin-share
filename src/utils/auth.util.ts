import { createContext } from "react";
import aw from "./appwrite.util";

const isSignedIn = async () => {
  try {
    await aw.account.get();
    return true;
  } catch {
    return false;
  }
};

export const IsSignedInContext = createContext(true);

export default {
  isSignedIn,
};
