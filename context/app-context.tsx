import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useState,
} from "react";
import Router from "next/router";
interface IAppProvider {
  children: any;
}

interface ICtx {
  loaderActive: boolean;
  setLoaderActiver: (active: boolean) => void;
}

const AppContext = createContext<ICtx | any>({});

const AppProvider: FC<IAppProvider> = ({ children }) => {
  const [loaderActive, setLoaderActive] = useState(true);

  useEffect(() => {
    Router.events.on("routeChangeStart", () => setLoaderActive(true));
    Router.events.on("routeChangeComplete", () => setLoaderActive(false));
    Router.events.on("routeChangeError", () => setLoaderActive(false));
    return () => {
      Router.events.off("routeChangeStart", () => setLoaderActive(true));
      Router.events.off("routeChangeComplete", () => setLoaderActive(false));
      Router.events.off("routeChangeError", () => setLoaderActive(false));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Router.events]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setTimeout(() => {
        setLoaderActive(false);
      }, 2000);
    }
  }, []);

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
