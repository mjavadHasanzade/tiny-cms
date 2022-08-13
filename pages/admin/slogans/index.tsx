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

interface ISloganPage {
  slogans: ISlogan[];
}

const Slogans: NextPage<ISloganPage> = ({ slogans }) => {
  return (
    <Layout translations={""} isLogin={true}>
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

export const getServerSideProps: GetServerSideProps = async () => {
  const slogans = await prisma.slogan.findMany();

  return {
    props: { slogans },
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
