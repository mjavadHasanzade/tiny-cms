import Button from "@admin/atoms/button";
import Input from "@admin/atoms/input";
import Seo from "@admin/atoms/seo";
import Layout from "@admin/organisms/layout";
import camelCase from "@utils/camel-case";
import { getCookie } from "@utils/cookie";
import { useRouter } from "next/router";
import React, { useState } from "react";
import jwt from "jsonwebtoken";
import { GetServerSideProps } from "next";

type Props = {
  user: IUser;
};

const AddSetting = (props: Props) => {
  const [key, setKey] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const router = useRouter();

  const handleAddSetting = () => {
    const body = {
      key: camelCase(key),
      value,
    };
    fetch("/api/settings/create", {
      method: "post",
      headers: { xAuth: getCookie("xauth", document.cookie) },
      body: JSON.stringify(body),
    }).then(() => {
      router.push("/admin/site-settings");
    });
  };

  return (
    <Layout translations={""} isLogin={true} user={props.user}>
      <Seo title="Add New Slogan" />
      <h1>Add New Setting</h1>
      <Input
        name="Key"
        placeHolder="Key"
        value={key}
        onChange={(e) => setKey(e.target.value)}
      />

      <Input
        name="Value"
        placeHolder="Value"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <Button className="mt-3" onClick={() => handleAddSetting()}>
        Save
      </Button>
    </Layout>
  );
};

export default AddSetting;


export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const token = getCookie("xauth", ctx.req.headers.cookie as string);
  let user;

  if (!token) {
    return {
      redirect: {
        permanent: false,
        destination: "/tc-login",
      },
    };
  }

  try {
    user = jwt.verify(token, "tinyCmsJwtKey");
  } catch (error) {
    return {
      redirect: {
        permanent: false,
        destination: "/tc-login",
      },
    };
  }

  return {
    props: { user },
  };
};
