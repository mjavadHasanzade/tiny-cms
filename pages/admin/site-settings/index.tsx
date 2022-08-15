import Layout from "@organisms/layout";
import type { GetServerSideProps, NextPage } from "next";
import Title from "@atoms/title";
import Seo from "@atoms/seo";
import Table from "@organisms/table";
import prisma from "lib/prisma";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import Link from "next/link";
import styled from "styled-components";
import theme from "@utils/theme";
import { BiPencil } from "react-icons/bi";
import { getCookie } from "@utils/cookie";
import { useState } from "react";
import jwt from "jsonwebtoken";

interface ISiteSettingsPage {
  settings: string;
  user: IUser;
}

interface ISettingKV {
  key: string;
  value: string;
  id: number;
}

const SiteSettings: NextPage<ISiteSettingsPage> = (props) => {
  const [settings, setSetting] = useState<Array<ISettingKV>>(
    JSON.parse(props.settings)
  );

  const deleteItem = async (path: string, id: number | string) => {
    // setLoaderActiver(true);
    fetch(path + id, {
      method: "delete",
      headers: { xauth: getCookie("xauth", document.cookie) },
    }).then(async (res) => {
      const newrows = await fetch(path, {
        headers: { xauth: getCookie("xauth", document.cookie) },
      });
      const tb = await newrows.json();
      setSetting(tb.settings);
    });
  };
  return (
    <Layout translations={""} isLogin={true} user={props.user}>
      <Seo title="Tiny CMS - Site Settings" />
      <SubContentToolsST>
        <Title
          hasBorder={false}
          styles={{ marginTop: "2rem" }}
          tag="h1"
          important="primary"
        >
          Site Settings
        </Title>
        <Link href={"/admin/site-settings/add"}>
          <a className="subContent__button">
            <FiPlus />
          </a>
        </Link>
      </SubContentToolsST>

      <div className="row mt-5">
        {settings.map((item) => (
          <div className="col-md-3" key={item.id}>
            <SettingCard>
              <h5>{item.key}</h5>
              <p>{item.value}</p>

              <div className="options">
                <span className="actions">
                  <Link href={"/admin/site-settings/" + item.id} passHref>
                    <button className="edit">
                      <BiPencil />
                    </button>
                  </Link>
                </span>
                <span className="actions">
                  <button
                    className="delete"
                    onClick={() => deleteItem("/api/settings/", item.id)}
                  >
                    <FiTrash2 />
                  </button>
                </span>
              </div>
            </SettingCard>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default SiteSettings;

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
  const settings = await prisma.settings.findMany();

  return {
    props: { settings: JSON.stringify(settings), user },
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

const SettingCard = styled.div`
  border: 1px solid;
  padding: 1rem;
  box-shadow: 0 0 10px -5px #2f4f4fa2;

  h5 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }
  p {
    font-size: 0.9rem;
    margin-bottom: 0;
  }

  .options {
    display: flex;
    margin-top: 1rem;
    justify-content: flex-end;

    .actions {
      button {
        border: none;
        padding: 0.5rem;
        margin: 0 0.5rem 0 0;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 10px;
        color: #fff;

        &.edit {
          background-color: #33b9f3;
        }

        &.delete {
          background-color: #fa5c34;
        }
      }
    }
  }
`;
