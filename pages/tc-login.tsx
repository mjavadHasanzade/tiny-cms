import Button from "@admin/atoms/button";
import Input from "@admin/atoms/input";
import Seo from "@admin/atoms/seo";
import Title from "@admin/atoms/title";
import { deleteCookie, getCookie, setCookie } from "@utils/cookie";
import theme from "@utils/theme";
import { useRouter } from "next/router";
import React, { useState } from "react";
import styled from "styled-components";

const Login = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
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
        deleteCookie("xauth");
        setCookie("xauth", data.token, 10);
        router.push("/admin");
      })
      .catch(() => {
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
            <Button onClick={() => handleLogin()}>Submit</Button>
          </div>
        </LoginBoxST>
      </LoginST>
    </>
  );
};

export default Login;

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
