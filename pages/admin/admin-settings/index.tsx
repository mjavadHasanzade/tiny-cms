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
interface IAdminSettings {
  user: IUser;
  users: IUser[];
}

const AdminSettings: NextPage<IAdminSettings> = (props) => {
  const [currentUsers, setCurrentUsers] = useState<Array<IUser>>(props.users);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    email: "",
    phone: "",
  });
  const [userActive, setUserActive] = useState(false);

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
      })
      .catch((err) => {
        setCurrentUsers(cu);
        return toast.error(err.message);
      });
  };

  const handleAddUser = () => {
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
      })
      .catch((err) => {
        return toast.error(err.message);
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
              onChange={(e) => editSubContentsHandler(e.target.value, "email")}
            />
            <input
              type="text"
              placeholder="Phone"
              onChange={(e) => editSubContentsHandler(e.target.value, "phone")}
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
    </Layout>
  );
};

export default AdminSettings;

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
    //@ts-ignore
    if (user.role !== "admin") {
      return {
        redirect: {
          permanent: false,
          destination: "/admin?access=denied",
        },
      };
    }
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
