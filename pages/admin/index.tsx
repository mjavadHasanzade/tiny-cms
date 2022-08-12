import Layout from "@organisms/layout";
import type { GetServerSideProps, NextPage } from "next";
import Title from "@atoms/title";
import Seo from "@atoms/seo";
import theme from "@utils/theme";
import styled from "styled-components";
import Tile from "@molecules/tile";
import { GrIteration, GrHtml5 } from "react-icons/gr";
import { CgEye } from "react-icons/cg";
import Table from "@organisms/table";
import { getCookie } from "@utils/cookie";
import jwt from "jsonwebtoken";

const TABLE = [
  { id: 1, username: "Mjavad", comments: "آه هویریه" },
  { id: 2, username: "Mohmo", comments: "چاپ بزرگ علامت نیومدنه" },
];

const Home: NextPage = () => {
  return (
    <Layout translations={""} isLogin={true}>
      <Seo title="Tiny CMS - Home" />
      <Title
        hasBorder={false}
        styles={{ marginTop: "2rem" }}
        tag="h1"
        important="primary"
      >
        Hello John
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
          counter="45"
          icon={<GrIteration />}
        />
        <Tile
          title="Slogans"
          description="Total Slogans"
          counter="105"
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
        <Table body={TABLE} tablePath="/comments" title="Latest Comments" />
        <Table
          body={[
            { id: 1, email: "mjavad@loagency.de", text: "Hello I need Help" },
          ]}
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

  const isAuth = jwt.verify(token, "tinyCmsJwtKey");

  if (!token || !isAuth) {
    return {
      redirect: {
        permanent: false,
        destination: "/tc-login",
      },
    };
  }

  return {
    props: {},
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
