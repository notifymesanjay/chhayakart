import React, { createContext, useContext, useEffect } from "react";
import { ResponsiveProvider } from "./shared/use-responsive";

const AppContext = createContext();

export function AppWrapper({ children }) {

  return (
    <AppContext.Provider value={{}}>
      <ResponsiveProvider>{children}</ResponsiveProvider>
    </AppContext.Provider>
  );
}

export default function useAppContext() {
  return useContext(AppContext);
}
