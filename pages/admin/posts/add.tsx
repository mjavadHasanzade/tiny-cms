import Button from "@atoms/button";
import Checkbox from "@atoms/check";
import Input from "@atoms/input";
import Quill from "@atoms/quill";
import Seo from "@atoms/seo";
import Layout from "@organisms/layout";
import { getCookie } from "@utils/cookie";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import jwt from "jsonwebtoken";

type Props = {
  user: IUser;
};

const AddPost = (props: Props) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [checkbox, setCheckbox] = useState<boolean>(false);
  const router = useRouter();

  const handleAddSlogan = () => {
    const body = {
      title,
      description,
      published: checkbox,
    };
    fetch("/api/posts/create", {
      method: "post",
      headers: { xAuth: getCookie("xauth", document.cookie) },
      body: JSON.stringify(body),
    }).then(() => {
      router.push("/admin/posts");
    });
  };

  return (
    <Layout translations={""} isLogin={true} user={props.user}>
      <Seo title="Add New Slogan" />
      <h1>Add New Post</h1>
      <Input
        name="Title"
        placeHolder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <Quill value={description ? description : ""} onChange={setDescription} />
      <Checkbox
        className="switch"
        onChange={() => setCheckbox(!checkbox)}
        checked={checkbox}
        label="Publish Now"
        name="publishNow"
        readonly={false}
      />
      <Button onClick={() => handleAddSlogan()}>Save</Button>
    </Layout>
  );
};

export default AddPost;

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
