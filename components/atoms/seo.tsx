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
        href="https://fonts.googleapis.com/css2?family=Edu+SA+Beginner:wght@500;700&family=Poppins:wght@300&display=swap"
        rel="stylesheet"
      />
    </Head>
  );
};

export default Seo;
