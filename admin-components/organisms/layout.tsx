import React, { FC } from "react";
import styled, {
  ThemeProvider,
  createGlobalStyle,
  css,
} from "styled-components";
import theme from "@utils/admin/theme";
import { media } from "@utils/media";

import { useRouter } from "next/router";
import Sidebar from "./sidebar";
import { Toaster } from "react-hot-toast";

const GlobalStyle = createGlobalStyle`

    html, body {
    height: 100%;
    overflow-x: hidden;
    font-family: 'M PLUS Rounded 1c',-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    ${(props) =>
      // @ts-ignore
      !props.theme.rtl &&
      css`
        letter-spacing: -0.015em;
      `}
    
    ul{
        list-style: none;
    }
  }

  a{
      text-decoration: none;
      &:hover{
        text-decoration: none;
      }
  }

  .img-fluid {
    max-width: 100%;
    height: auto;
  }


  .bold-primary{
      color: ${theme.colors.primary};
      font-weight: bold;
  }

  .text-center{
      text-align:center !important;
  }

  .scrollHide{
    scrollbar-width: none;  /* Firefox */
    -ms-overflow-style: none;  /* IE and Edge */
    &::-webkit-scrollbar {
        display: none;
    }
  }

  .react-slidedown {
    transition-duration: .25s;
    transition-timing-function: ease-in-out;
   }

   
    .ReactModal__Overlay{
        background-color: rgba(0,0,0,.75) !important;
        z-index: 999;
    }

    .ReactModal__Content{
        @media ${media.sm}{
            padding: 2.5rem !important;
        }
    }

    input[type=number] {
        &::-webkit-inner-spin-button ,
        &::-webkit-outer-spin-button{
            -webkit-appearance: none;
            margin: 0;
        }

        -moz-appearance: textfield;
    }

      
  .mobVisible {
    @media ${media.sm}{
        display: none !important;
    }
  }
  .deskVisible {
    display: none !important;

    @media ${media.sm}{
        display: block !important;
    }
  }
`;

interface ILayout {
  children?: React.ReactNode;
  isInnerPage?: boolean;
  isLogin?: boolean;
  translations: any;
  user: IUser;
}

const Layout: FC<ILayout> = ({
  children,
  translations,
  isInnerPage = false,
  isLogin = true,
  user,
}) => {
  const { locale } = useRouter();
  const isRtl = locale === "fa";

  return (
    <ThemeProvider
      theme={{
        ...theme,
        rtl: isRtl,
      }}
    >
      <GlobalStyle />
      {children && (
        <Main isLogin={isLogin}>
          {isLogin && <Sidebar user={user} />}
          <div className="childrenContent">{children}</div>
        </Main>
      )}
      <Toaster />
    </ThemeProvider>
  );
};

export default Layout;

interface IMain {
  isLogin: boolean;
}
const Main = styled.main<IMain>`
  display: flex;
  min-height: calc(100vh - 64px);
  .childrenContent {
    padding: 1rem 2rem;
    width: ${(props) => (props.isLogin ? "85%" : "100%")};
    flex: 0 0 ${(props) => (props.isLogin ? "85%" : "100%")};
    margin-left: auto;
  }
`;
