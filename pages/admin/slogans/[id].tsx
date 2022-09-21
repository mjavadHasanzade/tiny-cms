import Button from "@admin/atoms/button";
import Input from "@admin/atoms/input";
import Quill from "@admin/atoms/quill";
import Seo from "@admin/atoms/seo";
import Layout from "@admin/organisms/layout";
import camelCase from "@utils/camel-case";
import { getCookie } from "@utils/cookie";
import theme from "@utils/admin/theme";
import prisma from "lib/prisma";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
import styled from "styled-components";
import jwt from "jsonwebtoken";
import Message from "@admin/atoms/message";

type Props = {
  slogan: string;
  user: IUser;
};

const Editslogn = (props: Props) => {
  const slogan: ISlogan = JSON.parse(props.slogan);

  const router = useRouter();

  const [title, setTitle] = useState(slogan.title);
  const [content, setContent] = useState(slogan.content);
  const [subContent, setSubContent] = useState<Array<ISubContent>>(
    slogan.subContent || []
  );
  const [name, setName] = useState<string>(slogan.name);
  const [link, setLink] = useState<string>(slogan.link ? slogan.link : "");
  const [message, setMessage] = useState<string>("");

  const addSubContentHandler = () => {
    const scia = [...subContent];
    scia.push({ name: "", content: "" });
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

  const handleEditSlogan = () => {
    const body = {
      title,
      link,
      name,
      content,
      subContent: subContent,
    };
    fetch("/api/slogans/" + slogan.id, {
      method: "put",
      headers: { xAuth: getCookie("xauth", document.cookie) },
      body: JSON.stringify(body),
    }).then(() => {
      router.push("/admin/slogans");
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

  return (
    <Layout translations={""} isLogin={true} user={props.user}>
      <Seo title={`Edit ${slogan.title}`} />
      <h1>Edit {slogan.title}</h1>
      {message && <Message>{message}</Message>}
      <Input
        name={"Title"}
        placeHolder={"Title"}
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
              defaultValue={item.name}
              onChange={(e) =>
                editSubContentsHandler(e.target.value, "name", index)
              }
            />
            <input
              type="text"
              placeholder="Link"
              defaultValue={item.link}
              onChange={(e) =>
                editSubContentsHandler(e.target.value, "link", index)
              }
            />
            <textarea
              placeholder="Content"
              defaultValue={item.content}
              onChange={(e) =>
                editSubContentsHandler(e.target.value, "content", index)
              }
            ></textarea>
          </div>
        ))}
      </SubContentsST>

      <Button onClick={() => handleEditSlogan()}>Save</Button>
    </Layout>
  );
};

export default Editslogn;

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
    const slogan = await prisma.slogan.findUnique({
      where: { id: Number(id) },
      include: { subContent: true },
    });
    return {
      props: {
        slogan: JSON.stringify(slogan),
        user,
      },
    };
  } catch (error) {
    return {
      props: {
        message: error,
        slogan: [],
      },
    };
  }
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
