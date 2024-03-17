import React, { ReactNode, useState } from "react";

interface AppContextState {
  count: number;
}

interface AppContextValue extends AppContextState {
  addCount: () => void;
}

const AppContext = React.createContext({} as AppContextValue);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AppContextState>(DEFAULT_STATE);

  const addCount = () => {
    setState((prev) => ({
      ...prev,
      count: prev.count + 1,
    }));
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        addCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;

const DEFAULT_STATE: AppContextState = {
  count: 0,
};
