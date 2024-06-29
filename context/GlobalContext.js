"use client";

import { createContext, useContext, useState } from "react";

//* 1. Create context
const GlobalContext = createContext();

//* 2. Create a Provider
export function GlobalProvider({ children }) {
  const [unreadCount, setUnreadCount] = useState(0);

  return (
    <GlobalContext.Provider value={{ unreadCount, setUnreadCount }}>
      {children}
    </GlobalContext.Provider>
  );
}

//* 3. Create a custom hook to access context
export function useGlobalContext() {
  return useContext(GlobalContext);
}
