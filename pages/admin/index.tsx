import Layout from "@admin/organisms/layout";
import type {
  GetServerSideProps,
  NextPage,
  InferGetServerSidePropsType,
} from "next";
import Title from "@admin/atoms/title";
import Seo from "@admin/atoms/seo";
import theme from "@utils/admin/theme";
import styled from "styled-components";
import Tile from "@admin/molecules/tile";
import { GrIteration, GrHtml5 } from "react-icons/gr";
import { CgEye } from "react-icons/cg";
import Table from "@admin/organisms/table";
import { getCookie } from "@utils/cookie";
import jwt from "jsonwebtoken";
import prisma from "lib/prisma";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

interface IHomePage {
  slogansCount: number;
  postsCount: number;
  user: IUser;
  forms: IForms[];
  comments: IComments[];
}

const Home: NextPage<IHomePage> = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const forms: IForms[] = JSON.parse(props.forms ? props.forms : "[]");
  const comments: IComments[] = JSON.parse(
    props.comments ? props.comments : "[]"
  );
  const router = useRouter();
  forms.map((i) => {
    i.text = i.fields.description;
    i.user = i.fields.name + " " + i.fields.family;
  });
  useEffect(() => {
    if (router.query.access === "denied") {
      toast.error("Access Denied");
    }
  }, []);

  return (
    <Layout translations={""} isLogin={true} user={props.user}>
      <Seo title="Tiny CMS - Home" />
      <Title
        hasBorder={false}
        styles={{ marginTop: "2rem" }}
        tag="h1"
        important="primary"
      >
        Hello {props.user.username}
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
          counter={String(props.postsCount)}
          icon={<GrIteration />}
        />
        <Tile
          title="Slogans"
          description="Total Slogans"
          counter={String(props.slogansCount)}
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
          body={comments}
          tablePath="/comments"
          title="Latest Comments"
          minus={["id", "postId"]}
          apiPath=""
        />
        <Table
          apiPath=""
          body={forms}
          tablePath="/forms"
          minus={["fields", "description", "id"]}
          title="Latest Connections"
        />
      </TablesWrapper>
    </Layout>
  );
};

export default Home;

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

  const postsCount = await prisma.post.count();
  const slogansCount = await prisma.slogan.count();

  const forms = JSON.stringify(
    await prisma.forms.findMany({ orderBy: { createdAt: "asc" }, take: 8 })
  );

  const comments = JSON.stringify(
    await prisma.comment.findMany({ orderBy: { createdAt: "asc" }, take: 8 })
  );

  return {
    props: {
      slogansCount,
      postsCount,
      user,
      forms,
      comments,
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
