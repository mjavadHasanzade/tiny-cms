import Layout from "@admin/organisms/layout";
import type { GetServerSideProps, NextPage } from "next";
import Title from "@admin/atoms/title";
import Seo from "@admin/atoms/seo";
import styled from "styled-components";
import theme from "@utils/admin/theme";
import { getCookie } from "@utils/cookie";
import jwt from "jsonwebtoken";
import prisma from "lib/prisma";

interface ISiteStatistics {
  user: IUser;
}

const SiteStatistics: NextPage<ISiteStatistics> = (props) => {
  return (
    <Layout translations={""} isLogin={true} user={props.user}>
      <Seo title="Tiny CMS - Site Statistics" />
      <SubContentToolsST>
        <Title
          hasBorder={false}
          styles={{ marginTop: "2rem" }}
          tag="h1"
          important="primary"
        >
          Site Statistics
        </Title>
      </SubContentToolsST>
    </Layout>
  );
};

export default SiteStatistics;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const token = getCookie("xauth", ctx.req.headers.cookie as string);
  let user: any;

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

  return {
    props: { user },
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
