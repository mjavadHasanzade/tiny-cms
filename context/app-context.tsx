import React, { createContext, FC, useContext, useState } from "react";

interface IAppProvider {
  children: any;
}

interface ICtx {
  loaderActive: boolean;
  setLoaderActiver: (active: boolean) => void;
}

const AppContext = createContext<ICtx | any>({});

const AppProvider: FC<IAppProvider> = ({ children }) => {
  const [loaderActive, setLoaderActive] = useState(false);

  //? functions

  const setLoaderActiver = (active: boolean) => {
    if (active == false) {
      setTimeout(() => {
        setLoaderActive(active);
      }, 1000);
      return false;
    }
    setLoaderActive(active);
  };

  return (
    <AppContext.Provider
      value={{
        loaderActive,
        setLoaderActiver,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;

export const useAppContext = () => useContext<ICtx>(AppContext);
