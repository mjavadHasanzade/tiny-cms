import Layout from "@admin/organisms/layout";
import type { GetServerSideProps, NextPage } from "next";
import Title from "@admin/atoms/title";
import Seo from "@admin/atoms/seo";
import theme from "@utils/theme";
import styled from "styled-components";
import Tile from "@admin/molecules/tile";
import { GrIteration, GrHtml5 } from "react-icons/gr";
import { CgEye } from "react-icons/cg";
import Table from "@admin/organisms/table";
import { getCookie } from "@utils/cookie";
import jwt from "jsonwebtoken";
import prisma from "lib/prisma";

interface IHomePage {
  slogansCount: number;
  postsCount: number;
  user: IUser;
}

const Home: NextPage<IHomePage> = ({ slogansCount, postsCount, user }) => {

  return (
    <Layout translations={""} isLogin={true} user={user}>
      <Seo title="Tiny CMS - Home" />
      <Title
        hasBorder={false}
        styles={{ marginTop: "2rem" }}
        tag="h1"
        important="primary"
      >
        Hello {user.username}
      </Title>
      <Title
        hasBorder={false}
        styles={{
          color: theme.colors.tertiary,
          marginTop: "-1rem",
          fontSize: "1rem",
        }}
      >
        Welcome Back
      </Title>

      <TilesWrapper>
        <Tile
          title="Posts"
          description="Total Posts"
          counter={String(postsCount)}
          icon={<GrIteration />}
        />
        <Tile
          title="Slogans"
          description="Total Slogans"
          counter={String(slogansCount)}
          icon={<GrHtml5 />}
        />
        <Tile
          title="Visits"
          description="This Month Visits"
          counter="1105"
          icon={<CgEye />}
        />
      </TilesWrapper>
      <TablesWrapper>
        <Table
          body={[]}
          tablePath="/comments"
          title="Latest Comments"
          apiPath=""
        />
        <Table
          apiPath=""
          body={[]}
          tablePath="/forms"
          title="Latest Connections"
        />
      </TablesWrapper>
    </Layout>
  );
};

export default Home;

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

  const postsCount = await prisma.post.count();
  const slogansCount = await prisma.slogan.count();

  return {
    props: {
      slogansCount,
      postsCount,
      user,
    },
  };
};

const TilesWrapper = styled.div`
  display: flex;
  & > * {
    flex: 0 0 calc(33.333333% - 35px);
    margin: 15px;
  }
`;

const TablesWrapper = styled.div`
  display: flex;
  & > * {
    flex: 0 0 calc(50% - 35px);
    margin: 15px;
  }
`;
