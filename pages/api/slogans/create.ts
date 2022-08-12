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
  req.body = JSON.parse(req.body);

  //@ts-ignore
  req.body.userId = req.user.id;
  const { name, title, content, image, userId, subContent } = req.body;

  try {
    const slogan = await prisma.slogan.create({
      data: {
        name,
        content,
        image,
        userId,
        title,
        subContent: {
          create: subContent,
        },
      },
    });
    res.send({ message: "Slogan Created Successfully", slogan });
  } catch (error) {
    res.send({ message: "Slogan Did'nt Create! Something Went Wrong", error });
  }
}
