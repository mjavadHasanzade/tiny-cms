import Layout from "@admin/organisms/layout";
import type { GetServerSideProps, NextPage } from "next";
import Title from "@admin/atoms/title";
import Seo from "@admin/atoms/seo";
import styled from "styled-components";
import theme from "@utils/admin/theme";
import { getCookie } from "@utils/cookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import { FiPlus } from "react-icons/fi";
import { useState } from "react";
import Button from "@admin/atoms/button";
import toast from "react-hot-toast";
import prisma from "lib/prisma";
import { useAppContext } from "context/app-context";
import ImageSelector from "@admin/atoms/image-selector";
import { useRef } from "react";
interface IAdminSettings {
  user: IUser;
  users: IUser[];
}

const AdminSettings: NextPage<IAdminSettings> = (props) => {
  const { setLoaderActiver, user, setUser } = useAppContext();
  const [currentUsers, setCurrentUsers] = useState<Array<IUser>>(props.users);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    email: "",
    phone: "",
  });
  const [userActive, setUserActive] = useState(false);
  const [image, setImage] = useState<string | undefined>(props.user.image);
  const inputFile = useRef<HTMLInputElement>();
  console.log(props.user);

  const editSubContentsHandler = (
    value: string,
    type: keyof IUser,
    id?: number
  ) => {
    if (!id) {
      const ediedUser = { ...newUser };
      //@ts-ignore
      ediedUser[type] = value;

      setNewUser(ediedUser);
    } else {
    }
  };

  const deleteSubContentHandler = (id: number) => {
    setLoaderActiver(true);
    const cu = [...currentUsers];
    const scia = currentUsers.filter((item, index) => {
      if (item.id !== id) return item;
    });
    setCurrentUsers(scia);

    fetch("/api/register/" + id, {
      method: "delete",
      headers: { xAuth: getCookie("xauth", document.cookie) },
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.status > 300) {
          setCurrentUsers(cu);
          return toast.error(data.message);
        }
        toast.success(data.message);
        setLoaderActiver(false);
      })
      .catch((err) => {
        setCurrentUsers(cu);
        setLoaderActiver(false);
        return toast.error(err.message);
      });
  };

  const handleAddUser = () => {
    setLoaderActiver(true);
    fetch("/api/register", {
      method: "post",
      body: JSON.stringify(newUser),
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.status > 300) {
          return toast.error(data.message);
        }
        toast.success(data.message);
        setLoaderActiver(false);
      })
      .catch((err) => {
        setLoaderActiver(false);
        return toast.error(err.message);
      });
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
        fetch("/api/login/upload/" + user.id, {
          method: "post",
          body: JSON.stringify({ image: data.url }),
          headers: { xauth: getCookie("xauth", document.cookie) },
        }).then(() => {
          const userInfo = { ...user };
          userInfo.image = image;
          setUser(user);
        });
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
      })
      .catch(async (err) => {
        setLoaderActiver(false);
        toast.error(err.message);
      });
  };

  return (
    <Layout translations={""} isLogin={true} user={props.user}>
      <Seo title="Tiny CMS - Admin Settings" />
      <SubContentToolsST>
        <Title
          hasBorder={false}
          styles={{ marginTop: "2rem" }}
          tag="h1"
          important="primary"
        >
          Admin Settings
        </Title>
      </SubContentToolsST>

      <Title
        hasBorder={false}
        styles={{ marginTop: "2rem" }}
        tag="h5"
        important="primary"
      >
        Upload Profile Photo
      </Title>

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
      {user?.role === "admin" && (
        <>
          <SubContentToolsST style={{ borderBottom: "1px solid" }}>
            <Title
              hasBorder={false}
              styles={{ marginTop: "2rem" }}
              tag="h4"
              important="thired"
            >
              Add User
            </Title>
            {!userActive && (
              <button
                className="subContent__button"
                onClick={() => setUserActive(true)}
              >
                <FiPlus />
              </button>
            )}
          </SubContentToolsST>
          <SubContentsST>
            {userActive && (
              <div className="subContent__item">
                <button
                  className="subContent__button-delete"
                  onClick={() => setUserActive(false)}
                >
                  <FiPlus />
                </button>
                <input
                  type="text"
                  placeholder="Username"
                  onChange={(e) =>
                    editSubContentsHandler(e.target.value, "username")
                  }
                />
                <input
                  type="text"
                  placeholder="Password"
                  onChange={(e) =>
                    editSubContentsHandler(e.target.value, "password")
                  }
                />
                <input
                  type="text"
                  placeholder="Email"
                  onChange={(e) =>
                    editSubContentsHandler(e.target.value, "email")
                  }
                />
                <input
                  type="text"
                  placeholder="Phone"
                  onChange={(e) =>
                    editSubContentsHandler(e.target.value, "phone")
                  }
                />
                <div className="mt-3">
                  <Button onClick={() => handleAddUser()}>Submit</Button>
                </div>
              </div>
            )}

            {currentUsers.map((item, index) => {
              return (
                <div className="subContent__item" key={index}>
                  <button
                    className="subContent__button-delete"
                    onClick={() => deleteSubContentHandler(item.id)}
                  >
                    <FiPlus />
                  </button>
                  <input
                    type="text"
                    placeholder="Username"
                    defaultValue={item.username}
                    readOnly
                    onChange={(e) =>
                      editSubContentsHandler(e.target.value, "username")
                    }
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    defaultValue={item.password}
                    readOnly
                    onChange={(e) =>
                      editSubContentsHandler(e.target.value, "password")
                    }
                  />
                  <input
                    type="text"
                    defaultValue={item.email}
                    placeholder="Email"
                    readOnly
                    onChange={(e) =>
                      editSubContentsHandler(e.target.value, "email")
                    }
                  />
                  <input
                    type="text"
                    placeholder="Phone"
                    defaultValue={item.phone}
                    readOnly
                    onChange={(e) =>
                      editSubContentsHandler(e.target.value, "phone")
                    }
                  />
                </div>
              );
            })}
          </SubContentsST>
        </>
      )}
    </Layout>
  );
};

export default AdminSettings;

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

  const users = await prisma.user.findMany({
    where: { NOT: { username: "admin" } },
  });

  return {
    props: { user, users },
  };
};

const SubContentToolsST = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

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
