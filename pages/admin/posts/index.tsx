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
import jwt from "jsonwebtoken";
import { getCookie } from "@utils/cookie";

interface IPostsPage {
  posts: string;
  user: IUser;
}

const Posts: NextPage<IPostsPage> = (props) => {
  const posts: IPosts = JSON.parse(props.posts);
  return (
    <Layout translations={""} isLogin={true} user={props.user}>
      <Seo title="Tiny CMS - Posts" />
      <SubContentToolsST>
        <Title
          hasBorder={false}
          styles={{ marginTop: "2rem" }}
          tag="h1"
          important="primary"
        >
          Posts
        </Title>
        <Link href={"/admin/posts/add"}>
          <a className="subContent__button">
            <FiPlus />
          </a>
        </Link>
      </SubContentToolsST>
      <Table
        body={posts}
        tablePath="posts/"
        apiPath="/api/posts/"
        minus={["userId", "id", "name"]}
        actions
      />
    </Layout>
  );
};

export default Posts;

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
  const posts = await prisma.post.findMany();

  return {
    props: { posts: JSON.stringify(posts), user },
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
