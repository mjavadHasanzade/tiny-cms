import Button from "@admin/atoms/button";
import Input from "@admin/atoms/input";
import Seo from "@admin/atoms/seo";
import Title from "@admin/atoms/title";
import { deleteCookie, getCookie, setCookie } from "@utils/cookie";
import theme from "@utils/theme";
import { useRouter } from "next/router";
import React, { useState } from "react";
import styled from "styled-components";
import toast, { Toaster } from "react-hot-toast";
import TClogo from "@atoms/tc-logo";
import { GetServerSideProps } from "next";
import prisma from "../lib/prisma";

const Login = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);
  const handleLogin = () => {
    setButtonLoading(true);
    const body = {
      username,
      password,
    };
    fetch("/api/login", {
      method: "post",
      body: JSON.stringify(body),
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.status > 300) {
          setButtonLoading(false);
          return toast.error(data.message);
        }
        deleteCookie("xauth");
        setCookie("xauth", data.token, 10);
        router.push("/admin");
        setButtonLoading(false);
      })
      .catch(() => {
        setButtonLoading(false);
        router.push("/tc-login");
      });
  };

  return (
    <>
      <Seo title="Login" />
      <LoginST>
        <Title className="login__title">Login</Title>
        <LoginBoxST>
          <Input
            type="text"
            name="Username"
            placeHolder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            type="password"
            name="Password"
            placeHolder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="mt-4 d-flex justify-content-center">
            {!buttonLoading ? (
              <Button onClick={() => handleLogin()}>Submit</Button>
            ) : (
              <TClogo active={true} />
            )}
          </div>
        </LoginBoxST>
      </LoginST>
      <Toaster />
    </>
  );
};

export default Login;

export const getServerSideProps: GetServerSideProps = async () => {
  const admin = await prisma.user.findUnique({ where: { username: "admin" } });
  if (!admin)
    await prisma.user.create({
      data: {
        username: process.env.ADMIN_USERNAME as string,
        password: process.env.ADMIN_PASSWORD as string,
        email: process.env.ADMIN_EMAIL as string,
      },
    });

  return {
    props: {},
  };
};

const LoginST = styled.div`
  background-color: ${theme.colors.white};
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-family: "Edu SA Beginner", cursive;
  font-family: "Poppins", sans-serif;

  & .login__title {
    border: none;
    margin-bottom: 1rem;
    font-weight: 700;
  }
`;

const LoginBoxST = styled.div`
  background-color: ${theme.colors.white};
  border: 2px solid ${theme.colors.primary};
  border-radius: 8px;
  padding: 2rem 3rem;
`;
