import prisma from "../../../lib/prisma";
import { decode } from "../../../utils/bcrypt";
import jwt from "jsonwebtoken";
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
  
  const settings = await prisma.settings.findMany({
    include: { user: { select: { username: true } } },
  });

  res.send({ settings });
}
