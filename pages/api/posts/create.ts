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

  try {
    const post = await prisma.post.create({
      data: req.body,
    });
    res.send({ message: "Post Created Successfully", post });
  } catch (error) {
    res.send({ message: "Post Did'nt Create! Something Went Wrong", error });
  }
}
