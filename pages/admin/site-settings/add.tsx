import Button from "@admin/atoms/button";
import Input from "@admin/atoms/input";
import Seo from "@admin/atoms/seo";
import Layout from "@admin/organisms/layout";
import { camelCase } from "@utils/text-manipulate";
import { getCookie } from "@utils/cookie";
import { useRouter } from "next/router";
import React, { useState } from "react";
import jwt from "jsonwebtoken";
import { GetServerSideProps } from "next";
import { useAppContext } from "context/app-context";
import { toast } from "react-hot-toast";
import prisma from "lib/prisma";

type Props = {
  user: IUser;
};

const AddSetting = (props: Props) => {
  const [key, setKey] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const router = useRouter();
  const { setLoaderActiver } = useAppContext();

  const handleAddSetting = () => {
    setLoaderActiver(true);
    const body = {
      key: camelCase(key),
      value,
    };
    fetch("/api/settings/create", {
      method: "post",
      headers: { xAuth: getCookie("xauth", document.cookie) },
      body: JSON.stringify(body),
    }).then(async (res) => {
      router.push("/admin/site-settings");
      setLoaderActiver(false);
      const data = await res.json();
      toast.success(data.message);
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
  let user: any;

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
    user = await prisma.user.findUnique({ where: { id: user.id } });
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
