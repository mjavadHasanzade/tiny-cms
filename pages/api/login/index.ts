import prisma from "lib/prisma";
import { decode } from "utils/bcrypt";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { username, password } = JSON.parse(req.body);

  const user = await prisma.user.findUnique({
    where: { username },
  });
  if (!user) return res.status(404).send({ message: "not Found" });

  if (!decode(user.password, password))
    return res.status(400).send({ message: "Incorrect Password" });

  res.json({
    token: jwt.sign(user, "tinyCmsJwtKey"),
    message: "Login Successfully",
  });
}
