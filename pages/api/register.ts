import prisma from "../../lib/prisma";
import { decode } from "../../utils/bcrypt";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { encode } from "../../utils/bcrypt";

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { username } = req.body;

  const user = await prisma.user.findUnique({
    where: { username },
  });
  if (user) return res.status(400).send({ message: "User Already Exists" });

  req.body.password = await encode(req.body.password);

  const newUser = await prisma.user.create({ data: req.body });
  res.json({
    token: jwt.sign(newUser, "tinyCmsJwtKey"),
    message: "Register Successfully",
  });
}
