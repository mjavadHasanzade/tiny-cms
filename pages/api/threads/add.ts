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

  try {
    const thread = await prisma.thread.create({
      data: req.body,
    });
    res.send({ message: "Thread Created Successfully", thread });
  } catch (error) {
    res.send({ message: "Thread Did'nt Create! Something Went Wrong", error });
  }
}
