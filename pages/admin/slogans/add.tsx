import Button from "@admin/atoms/button";
import Input from "@admin/atoms/input";
import Quill from "@admin/atoms/quill";
import Seo from "@admin/atoms/seo";
import Layout from "@admin/organisms/layout";
import camelCase from "@utils/camel-case";
import { getCookie } from "@utils/cookie";
import theme from "@utils/admin/theme";
import jwt from "jsonwebtoken";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { FiPlus } from "react-icons/fi";
import styled from "styled-components";
import Message from "@admin/atoms/message";
import { useAppContext } from "context/app-context";
import { toast } from "react-hot-toast";
import ImageSelector from "@admin/atoms/image-selector";

type Props = {
  user: IUser;
};

const AddSlogn = (props: Props) => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const router = useRouter();

  const [subContent, setSubContent] = useState<Array<ISubContent>>([]);
  const { setLoaderActiver } = useAppContext();
  const [image, setImage] = useState<string | undefined>();
  const inputFile = useRef<HTMLInputElement>();

  const addSubContentHandler = () => {
    const scia = [...subContent];
    scia.push({ name: "", content: "", link: "" });
    setSubContent(scia);
  };

  const editSubContentsHandler = (
    value: string,
    type: keyof ISubContent,
    id: number
  ) => {
    const scia = [...subContent];
    //@ts-ignore
    scia[id][type] = value;

    setSubContent(scia);
  };

  const deleteSubContentHandler = (id: number) => {
    const scia = subContent.filter((item, index) => {
      if (index !== id) return item;
    });
    setSubContent(scia);
  };

  const handleAddSlogan = () => {
    const body = {
      title,
      name,
      link,
      content,
      image: image ? image : "",
      subContent: subContent,
    };
    setLoaderActiver(true);
    fetch("/api/slogans/create", {
      method: "post",
      headers: { xAuth: getCookie("xauth", document.cookie) },
      body: JSON.stringify(body),
    }).then(async (res) => {
      router.push("/admin/slogans");
      setLoaderActiver(false);
      const data = await res.json();
      toast.success(data.message);
    });
  };

  const handleTitleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    const reg = /^[a-zA-Z0-9$@$!%*?&#^-_. +]+$/;
    if (e.target.value.length >= 0 && reg.test(e.target.value)) {
      setName(camelCase(e.target.value));
      setMessage("");
    } else {
      setName("");
      setMessage(
        "Dont Use Space and non English characters, only underScore Allowed"
      );
    }
  };
  const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reg = /^[a-zA-Z0-9$@$!%*?&#^-_. +]+$/;
    if (e.target.value.length >= 0 && reg.test(e.target.value)) {
      setName(camelCase(e.target.value));
      setMessage("");
    } else {
      setMessage(
        "Dont Use Space and non English characters, only underScore Allowed"
      );
      setName("");
    }
  };

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
        setImage(data.url);
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
        setImage(undefined);
        // @ts-ignore 
        fetch("/api/login/upload/" + user);
      })
      .catch(async (err) => {
        setLoaderActiver(false);
        toast.error(err.message);
      });
  };

  return (
    <Layout translations={""} isLogin={true} user={props.user}>
      <Seo title="Add New Slogan" />
      <h1>Add New Slogan</h1>

      {message && <Message>{message}</Message>}
      <Input
        name="Title"
        placeHolder="Title"
        value={title}
        onChange={(e) => handleTitleName(e)}
      />

      <Input
        name="Name"
        placeHolder="Name"
        value={name}
        onChange={(e) => handleName(e)}
      />

      <Quill value={content ? content : ""} onChange={setContent} />

      <Input
        name="Link"
        placeHolder="Link"
        value={link}
        onChange={(e) => setLink(e.target.value)}
      />

      <ImageSelector
        img={image}
        onClick={() => inputFile.current?.click()}
        onClickDelete={() => handleDeleteUploadedFile(image as string)}
      >
        <input
          //@ts-ignore
          ref={inputFile}
          type={"file"}
          className="d-none"
          onChange={(e) => handleUploadFile(e)}
        />
      </ImageSelector>

      <SubContentToolsST>
        <h2>Sub Contents</h2>
        <button
          className="subContent__button"
          onClick={() => addSubContentHandler()}
        >
          <FiPlus />
        </button>
      </SubContentToolsST>

      <SubContentsST>
        {subContent.length <= 0 && "No SubContent Yet"}
        {subContent?.map((item, index) => (
          <div key={index} className="subContent__item">
            <button
              className="subContent__button-delete"
              onClick={() => deleteSubContentHandler(index)}
            >
              <FiPlus />
            </button>
            <input
              type="text"
              placeholder="Title"
              onChange={(e) =>
                editSubContentsHandler(e.target.value, "name", index)
              }
            />
            <input
              type="text"
              placeholder="Link"
              onChange={(e) =>
                editSubContentsHandler(e.target.value, "link", index)
              }
            />
            <textarea
              placeholder="Content"
              onChange={(e) =>
                editSubContentsHandler(e.target.value, "content", index)
              }
            ></textarea>
          </div>
        ))}
      </SubContentsST>

      <Button onClick={() => handleAddSlogan()}>Save</Button>
    </Layout>
  );
};

export default AddSlogn;

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
    // @ts-ignore
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

const SubContentsST = styled.div`
  padding: 1rem;

  .subContent__item {
    text-align: center;
  }
  input,
  textarea {
    display: block;
    margin: 0.5rem 1rem;
    width: 75%;

    border: 0.5px solid ${theme.colors.primary}40;
    padding: 1rem;
    display: inline-block;
    margin: 0.5rem auto;
    font-size: 0.8rem;
    letter-spacing: 0.5px;
    text-align: ${(props) => (props.theme.rtl ? "right" : "left")};
    transition: 0.3s ease all;
    &::placeholder {
      color: #bdbdbd;
    }
  }

  .subContent__item {
    width: 100%;
    padding: 1rem;
    margin: 1rem 0;
    background-color: #f5f6f7;
    position: relative;
  }

  .subContent__button-delete {
    background-color: transparent;
    border: none;
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    transform: scale(1.2) rotate(45deg);
  }
`;

const SubContentToolsST = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;

  .subContent__button {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 0.5px solid ${theme.colors.primary}40;
    background-color: #fff;
    border-radius: 1px;
    padding: 0.4rem;
  }
`;
