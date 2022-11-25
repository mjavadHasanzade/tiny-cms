import Seo from "@admin/atoms/seo";
import TClogo from "@admin/atoms/tc-logo";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import styled from "styled-components";

type Props = {};

const Page404 = (props: Props) => {
  const router = useRouter();
  const [routerState, setRouterState] = useState("");
  useEffect(() => {
    setRouterState(router.asPath);
  }, []);

  if (routerState.startsWith("/admin")) {
    return (
      <Page404ContainerST>
        <Seo title="404 Not Found"></Seo>
        <div className="holder container">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/imgs/not-cry.png" alt="cry" />
          <div className="content">
            <div className="l404">
              <div className="h-1">4</div>
              <div className="h-2">
                <TClogo active={true} />
              </div>
              <div className="h-3">4</div>
            </div>
            <div className="dExist">
              the page you are looking for doesn't exist
            </div>
            <Link href={"/admin"}>
              <a className="backToDashboard">Back To Dashboard</a>
            </Link>
          </div>
        </div>
      </Page404ContainerST>
    );
  }
  return (
    <Regular404 visible={!routerState.startsWith("/admin")}>
      <h2>
        This is a <span style={{ color: "red" }}>404 page</span>
      </h2>
    </Regular404>
  );
};

export default Page404;

const Page404ContainerST = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  .holder {
    display: flex;
    & > * {
      flex: 0 0 50%;
      width: 50%;
    }
    img {
      max-width: 100%;
      height: auto;
    }

    .content {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      .l404 {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .h-1,
      .h-3 {
        font-size: 7rem;
        font-weight: 700;
        margin: 0 1rem;
      }

      .dExist {
        font-size: 1.5rem;
        font-weight: 400;
      }
      .backToDashboard {
        margin: 2rem 0 0 0;
        color: #5e5eec;
      }
    }
  }
`;

type TRegular404 = { visible: boolean };
const Regular404 = styled.div<TRegular404>`
  display: ${(props) => (props.visible ? "block" : "none")};
`;
