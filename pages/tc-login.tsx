import Button from "@atoms/button";
import Input from "@atoms/input";
import Seo from "@atoms/seo";
import Title from "@atoms/title";
import theme from "@utils/theme";
import React from "react";
import styled from "styled-components";

type Props = {};

const Login = (props: Props) => {
  return (
    <>
      <Seo title="Login" />
      <LoginST>
        <Title className="login__title">Login</Title>
        <LoginBoxST>
          <Input type="text" name="Username" placeHolder="Username" />
          <Input type="password" name="Password" placeHolder="Password" />
          <div className="mt-4 d-flex justify-content-center">
            <Button>Submit</Button>
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
