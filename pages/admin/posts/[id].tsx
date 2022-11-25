import Button from "@admin/atoms/button";
import Checkbox from "@admin/atoms/check";
import Input from "@admin/atoms/input";
import Quill from "@admin/atoms/quill";
import Seo from "@admin/atoms/seo";
import Layout from "@admin/organisms/layout";
import { getCookie } from "@utils/cookie";
import prisma from "lib/prisma";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import jwt from "jsonwebtoken";
import { useAppContext } from "context/app-context";
import { toast } from "react-hot-toast";
import ImageSelector from "@admin/atoms/image-selector";
import { slugify } from "@utils/text-manipulate";

type Props = {
  post: string;
  user: IUser;
};

const EditPost = (props: Props) => {
  const post: IPosts = JSON.parse(props.post);

  const [title, setTitle] = useState<string>(post.title);
  const [description, setDescription] = useState<string>(post.description);
  const [slug, setSlug] = useState<string>(post.slug);
  const [checkbox, setCheckbox] = useState<boolean>(post.published);
  const router = useRouter();
  const { setLoaderActiver } = useAppContext();
  const [cover, setCover] = useState<string | undefined>(post.cover);
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
      published: checkbox,
      cover: cover ? cover : "",
      slug,
    };
    fetch("/api/posts/" + post.id, {
      method: "put",
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
      <Seo title={`Edit Post ${title}`} />
      <h1>Edit Post {title}</h1>
      <Input
        name="Title"
        placeHolder="Title"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          setSlug(slugify(e.target.value));
        }}
      />
      <Input
        name="Slug"
        placeHolder="Slug"
        value={slug}
        onChange={(e) => setSlug(slugify(e.target.value))}
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

export default EditPost;

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
    const post = await prisma.post.findUnique({
      where: { id: Number(id) },
    });
    if (!post) {
      return {
        redirect: {
          permanent: false,
          destination: "/admin/404",
        },
      };
    }
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
