import Button from "@admin/atoms/button";
import Input from "@admin/atoms/input";
import Seo from "@admin/atoms/seo";
import Layout from "@admin/organisms/layout";
import camelCase from "@utils/camel-case";
import { getCookie } from "@utils/cookie";
import prisma from "lib/prisma";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import jwt from "jsonwebtoken";
import { toast } from "react-hot-toast";
import { useAppContext } from "context/app-context";

type Props = {
  setting: string;
  user: IUser;
};

const EditSetting = (props: Props) => {
  const setting = JSON.parse(props.setting);

  const [key, setKey] = useState<string>(setting.key);
  const [value, setValue] = useState<string>(setting.value);
  const router = useRouter();

  const { setLoaderActiver } = useAppContext();

  const handleAddSetting = () => {
    setLoaderActiver(true);
    const body = {
      key: camelCase(key),
      value,
    };
    fetch("/api/settings/" + setting.id, {
      method: "put",
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
      <Seo title={`Edit ${key}`} />
      <h1>Edit {key}</h1>
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

export default EditSetting;

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

  const id = ctx.params?.id;
  if (isNaN(Number(id))) {
    return {
      redirect: {
        permanent: false,
        destination: "/admin/404",
      },
    };
  }
  try {
    if (!id) {
      throw new Error("Invalid Id");
    }
    const setting = await prisma.settings.findUnique({
      where: { id: Number(id) },
    });
    if (!setting) {
      return {
        redirect: {
          permanent: false,
          destination: "/admin/404",
        },
      };
    }
    return {
      props: {
        setting: JSON.stringify(setting),
        user,
      },
    };
  } catch (error) {
    return {
      props: {
        message: error,
        setting: [],
      },
    };
  }
};
