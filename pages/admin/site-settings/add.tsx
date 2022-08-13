import Button from "@atoms/button";
import Input from "@atoms/input";
import Seo from "@atoms/seo";
import Layout from "@organisms/layout";
import camelCase from "@utils/camel-case";
import { getCookie } from "@utils/cookie";
import { useRouter } from "next/router";
import React, { useState } from "react";

type Props = {};

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

export default AddSetting;
