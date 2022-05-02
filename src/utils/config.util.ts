import axios from "axios";
import { createContext, useContext } from "react";

export const ConfigContext = createContext<any>({});

export const useConfig = () => useContext(ConfigContext);

const getGonfig = async() => {
  return (await axios.get("/api/config")).data;
};

export default { getGonfig };
