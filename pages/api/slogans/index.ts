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
    const slogans = await prisma.slogan.findMany();
    res.send({ slogans });
  } catch (error) {
    res.send({ message: "Something Went Wrong", error });
  }
}
