import Layout from "@admin/organisms/layout";
import type {
  GetServerSideProps,
  NextPage,
  InferGetServerSidePropsType,
} from "next";
import Title from "@admin/atoms/title";
import Seo from "@admin/atoms/seo";
import Table from "@admin/organisms/table";
import prisma from "lib/prisma";
import { FiPlus } from "react-icons/fi";
import Link from "next/link";
import styled from "styled-components";
import theme from "@utils/admin/theme";
import jwt from "jsonwebtoken";
import { getCookie } from "@utils/cookie";

interface IPostsPage {
  forms: string;
  user: IUser;
}

const Posts: NextPage<IPostsPage> = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const forms: IForms = JSON.parse(props.forms);
  return (
    <Layout translations={""} isLogin={true} user={props.user}>
      <Seo title="Tiny CMS - Forms" />
      <SubContentToolsST>
        <Title
          hasBorder={false}
          styles={{ marginTop: "2rem" }}
          tag="h1"
          important="primary"
        >
          Forms
        </Title>
      </SubContentToolsST>
      <Table
        body={forms}
        tablePath="forms/"
        apiPath="/api/forms/"
        minus={["fields"]}
        actions
      />
    </Layout>
  );
};

export default Posts;

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
  const forms = await prisma.forms.findMany();

  return {
    props: { forms: JSON.stringify(forms), user },
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
