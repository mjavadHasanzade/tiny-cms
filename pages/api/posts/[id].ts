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
      await prisma.thread.deleteMany({
        where: { commentId: Number(req.query.id) },
      });
      await prisma.comment.deleteMany({
        where: { postId: Number(req.query.id) },
      });
      await prisma.post.delete({ where: { id: Number(req.query.id) } });
      res.send({ message: "Post Deleted Seccessfully" });
    } catch (error) {
      res.status(400).send({ message: "invalid Id", error });
    }
  } else if (req.method === "GET") {
    const slogan = await prisma.post.findUnique({
      where: { id: Number(req.query.id) },
    });
    res.send(slogan);
  } else {
    req.body = JSON.parse(req.body);

    //@ts-ignore
    req.body.userId = req.user.id;

    try {
      const post = await prisma.post.update({
        where: { id: Number(req.query.id) },
        data: req.body,
      });
      res.send({ message: "Post Edited Successfully", post });
    } catch (error) {
      res.status(400).send({
        message: "Post Did'nt Edit! Something Went Wrong",
        error,
      });
    }
  }
}
