import { createContext, Dispatch, SetStateAction } from "react";

export const GlobalLoadingContext = createContext<{
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}>({ isLoading: false, setIsLoading: () => {} });
