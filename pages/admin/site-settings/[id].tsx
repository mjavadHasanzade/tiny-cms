import Button from "@atoms/button";
import Input from "@atoms/input";
import Seo from "@atoms/seo";
import Layout from "@organisms/layout";
import camelCase from "@utils/camel-case";
import { getCookie } from "@utils/cookie";
import prisma from "lib/prisma";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";

type Props = {
  setting: string;
};

const EditSetting = (props: Props) => {
  const setting = JSON.parse(props.setting);

  const [key, setKey] = useState<string>(setting.key);
  const [value, setValue] = useState<string>(setting.value);
  const router = useRouter();

  const handleAddSetting = () => {
    const body = {
      key: camelCase(key),
      value,
    };
    fetch("/api/settings/" + setting.id, {
      method: "put",
      headers: { xAuth: getCookie("xauth", document.cookie) },
      body: JSON.stringify(body),
    }).then(() => {
      router.push("/admin/site-settings");
    });
  };

  return (
    <Layout translations={""} isLogin={true}>
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

export default EditSetting;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const id = ctx.params?.id;
  try {
    if (!id) {
      throw new Error("Invalid Id");
    }
    const setting = await prisma.settings.findUnique({
      where: { id: Number(id) },
    });
    return {
      props: {
        setting: JSON.stringify(setting),
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