import Layout from "@organisms/layout";
import type { GetServerSideProps, NextPage } from "next";
import Title from "@atoms/title";
import Seo from "@atoms/seo";
import Table from "@organisms/table";
import prisma from "lib/prisma";

interface ISloganPage {
  slogans: ISlogan[];
}

const Slogans: NextPage<ISloganPage> = ({ slogans }) => {
  return (
    <Layout translations={""} isLogin={true}>
      <Seo title="Tiny CMS - Home" />
      <Title
        hasBorder={false}
        styles={{ marginTop: "2rem" }}
        tag="h1"
        important="primary"
      >
        Slogans
      </Title>
      <Table body={slogans} tablePath="slogans" minus={["name", "userId"]} actions/>
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
