import React, { FC } from "react";
import Head from "next/head";

interface ISeo {
  title: string;
  children?: any;
  favicon?: string;
}

const Seo: FC<ISeo> = ({ title, children, favicon = "/imgs/NSA.png" }) => {
  return (
    <Head>
      <title>{title}</title>
      {children}
      <link rel="icon" href={favicon} />
    </Head>
  );
};

export default Seo