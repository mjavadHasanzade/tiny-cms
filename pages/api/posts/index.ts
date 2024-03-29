import prisma from "../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const rows = await prisma.post.findMany();
    res.send({ rows });
  } catch (error) {
    res.send({ message: "Something Went Wrong", error });
  }
}
