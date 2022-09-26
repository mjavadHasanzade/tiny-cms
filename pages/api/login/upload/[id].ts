import prisma from "lib/prisma";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import auth from "middlewares/auth";

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const isAuth = auth(req, res);
  if (!isAuth) return res.status(401).send({ message: "Access Denied !!!" });
  const id = req.query.id;
  req.body = JSON.parse(req.body);
  
  await prisma.user.update({
    where: { id: Number(id) },
    data: { image: req.body.image },
  });

  res.json({
    message: "Image Uploaded Successfully",
  });
}
