import Button from "@admin/atoms/button";
import Checkbox from "@admin/atoms/check";
import Input from "@admin/atoms/input";
import Quill from "@admin/atoms/quill";
import Seo from "@admin/atoms/seo";
import Layout from "@admin/organisms/layout";
import { getCookie } from "@utils/cookie";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { ChangeEventHandler, useRef, useState } from "react";
import jwt from "jsonwebtoken";
import { useAppContext } from "context/app-context";
import { toast } from "react-hot-toast";
import ImageSelector from "@admin/atoms/image-selector";

type Props = {
  user: IUser;
};

const AddPost = (props: Props) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [checkbox, setCheckbox] = useState<boolean>(false);
  const router = useRouter();
  const { setLoaderActiver } = useAppContext();
  const [cover, setCover] = useState<string| undefined>();
  const inputFile = useRef<HTMLInputElement>();

  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    //@ts-ignore
    const file = e!.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    setLoaderActiver(true);
    fetch("/api/upload", {
      body: formData,
      method: "POST",
      headers: { xauth: getCookie("xauth", document.cookie) },
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.status >= 300) throw new Error(data.message);
        setLoaderActiver(false);
        toast.success(data.message);
        setCover(data.url);
      })
      .catch(async (err) => {
        setLoaderActiver(false);
        toast.error(err.message);
      });
  };

  const handleDeleteUploadedFile = (url: string) => {
    const urlItems = url.split("/");
    setLoaderActiver(true);
    fetch("/api/upload/" + urlItems[urlItems.length - 1], {
      method: "DELETE",
      headers: { xauth: getCookie("xauth", document.cookie) },
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.status >= 300) throw new Error(data.message);
        setLoaderActiver(false);
        toast.success(data.message);
        setCover(undefined);
      })
      .catch(async (err) => {
        setLoaderActiver(false);
        toast.error(err.message);
      });
  };

  const handleAddSlogan = () => {
    setLoaderActiver(true);
    const body = {
      title,
      description,
      cover: cover ? cover : "",
      published: checkbox,
    };
    fetch("/api/posts/create", {
      method: "post",
      headers: { xAuth: getCookie("xauth", document.cookie) },
      body: JSON.stringify(body),
    }).then(async (res) => {
      router.push("/admin/posts");
      setLoaderActiver(false);
      const data = await res.json();
      toast.success(data.message);
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
      <ImageSelector
        img={cover}
        onClick={() => inputFile.current?.click()}
        onClickDelete={() => handleDeleteUploadedFile(cover as string)}
      >
        <input
        //@ts-ignore
          ref={inputFile}
          type={"file"}
          className="d-none"
          onChange={(e) => handleUploadFile(e)}
        />
      </ImageSelector>
      <Checkbox
        className="switch"
        onChange={() => setCheckbox(!checkbox)}
        checked={checkbox}
        label="Publish Now"
        name="publishNow"
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
