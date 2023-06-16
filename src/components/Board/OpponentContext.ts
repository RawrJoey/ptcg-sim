import { createContext, useContext } from "react";

export const OpponentContext = createContext<boolean | null>(null);

export const useOpponentContext = () => useContext(OpponentContext);