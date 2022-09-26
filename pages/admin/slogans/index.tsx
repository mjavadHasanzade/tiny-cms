import Layout from "@admin/organisms/layout";
import type { GetServerSideProps, NextPage } from "next";
import Title from "@admin/atoms/title";
import Seo from "@admin/atoms/seo";
import Table from "@admin/organisms/table";
import prisma from "lib/prisma";
import { FiPlus } from "react-icons/fi";
import Link from "next/link";
import styled from "styled-components";
import theme from "@utils/admin/theme";
import { getCookie } from "@utils/cookie";
import jwt from "jsonwebtoken"

interface ISloganPage {
  slogans: ISlogan[];
  user: IUser;
}

const Slogans: NextPage<ISloganPage> = ({ slogans, user }) => {
  return (
    <Layout translations={""} isLogin={true} user={user}>
      <Seo title="Tiny CMS - Home" />
      <SubContentToolsST>
        <Title
          hasBorder={false}
          styles={{ marginTop: "2rem" }}
          tag="h1"
          important="primary"
        >
          Slogans
        </Title>
        <Link href={"/admin/slogans/add"}>
          <a className="subContent__button">
            <FiPlus />
          </a>
        </Link>
      </SubContentToolsST>
      <Table
        body={slogans}
        tablePath="slogans/"
        apiPath="/api/slogans/"
        minus={["name", "userId", "id"]}
        actions
      />
    </Layout>
  );
};

export default Slogans;

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
    user = await prisma.user.findUnique({ where: { id: user.id } });
  } catch (error) {
    return {
      redirect: {
        permanent: false,
        destination: "/tc-login",
      },
    };
  }

  const slogans = await prisma.slogan.findMany();

  return {
    props: { slogans, user },
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
