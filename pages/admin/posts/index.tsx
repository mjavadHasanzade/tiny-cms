import Layout from "@organisms/layout";
import type { GetServerSideProps, NextPage } from "next";
import Title from "@atoms/title";
import Seo from "@atoms/seo";
import Table from "@organisms/table";
import prisma from "lib/prisma";
import { FiPlus } from "react-icons/fi";
import Link from "next/link";
import styled from "styled-components";
import theme from "@utils/theme";

interface IPostsPage {
  posts: string;
}

const Posts: NextPage<IPostsPage> = (props) => {
  const posts: IPosts = JSON.parse(props.posts);
  return (
    <Layout translations={""} isLogin={true}>
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

export const getServerSideProps: GetServerSideProps = async () => {
  const posts = await prisma.post.findMany();

  return {
    props: { posts: JSON.stringify(posts) },
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
