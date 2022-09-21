import prisma from "../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import auth from "../../../middlewares/auth";

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const isAuth = auth(req, res);
  if (!isAuth) return res.status(401).send({ message: "Access Denied !!!" });

  if (req.method === "DELETE") {
    try {
      await prisma.subContent.deleteMany({
        where: { sloganId: Number(req.query.id) },
      });
      await prisma.slogan.delete({ where: { id: Number(req.query.id) } });
      res.send({ message: "Slogan Deleted Seccessfully" });
    } catch (error) {
      res.status(400).send({ message: "invalid Id", error });
    }
  } else {
    req.body = JSON.parse(req.body);

    //@ts-ignore
    req.body.userId = req.user.id;
    const { name, title, content, image, userId, subContent, link } = req.body;
    
    try {
      const slogan = await prisma.slogan.update({
        where: { id: Number(req.query.id) },
        data: {
          name,
          content,
          image,
          userId,
          title,
          link,
        },
      });
      await prisma.subContent.deleteMany({ where: { sloganId: slogan.id } });
      subContent.map(async (item: ISubContent) => {
        await prisma.subContent.create({
          data: { ...item, sloganId: slogan.id },
        });
      });
      res.send({ message: "Slogan Edited Successfully", slogan });
    } catch (error) {
      res.status(400).send({
        message: "Slogan Did'nt Edit! Something Went Wrong",
        error,
      });
    }
  }
}
