import Button from "@atoms/button";
import Checkbox from "@atoms/check";
import Input from "@atoms/input";
import Quill from "@atoms/quill";
import Seo from "@atoms/seo";
import Layout from "@organisms/layout";
import { getCookie } from "@utils/cookie";
import prisma from "lib/prisma";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import jwt from "jsonwebtoken";

type Props = {
  post: string;
  user: IUser;
};

const EditPost = (props: Props) => {
  const post: IPosts = JSON.parse(props.post);

  const [title, setTitle] = useState<string>(post.title);
  const [description, setDescription] = useState<string>(post.description);
  const [checkbox, setCheckbox] = useState<boolean>(post.published);
  const router = useRouter();

  const handleAddSlogan = () => {
    const body = {
      title,
      description,
      published: checkbox,
    };
    fetch("/api/posts/" + post.id, {
      method: "put",
      headers: { xAuth: getCookie("xauth", document.cookie) },
      body: JSON.stringify(body),
    }).then(() => {
      router.push("/admin/posts");
    });
  };

  return (
    <Layout translations={""} isLogin={true} user={props.user}>
      <Seo title={`Edit Post ${title}`} />
      <h1>Edit Post {title}</h1>
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

export default EditPost;

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

  const id = ctx.params?.id;
  try {
    if (!id) {
      throw new Error("Invalid Id");
    }
    const post = await prisma.post.findUnique({
      where: { id: Number(id) },
    });
    return {
      props: {
        post: JSON.stringify(post),
        user,
      },
    };
  } catch (error) {
    return {
      props: {
        message: error,
        post: [],
      },
    };
  }
};
