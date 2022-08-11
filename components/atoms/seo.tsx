/* eslint-disable @next/next/no-page-custom-font */
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
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin={"crossOrigin"}
      />
      <link
        href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@300;400;700&display=swap"
        rel="stylesheet"
      />
    </Head>
  );
};

export default Seo;
