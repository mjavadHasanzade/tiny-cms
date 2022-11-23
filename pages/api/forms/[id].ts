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
      await prisma.forms.delete({ where: { id: Number(req.query.id) } });
      res.send({ message: "Form Deleted Seccessfully" });
    } catch (error) {
      res.status(400).send({ message: "invalid Id", error });
    }
  } else if (req.method === "GET") {
    const form = await prisma.forms.findUnique({
      where: { id: Number(req.query.id) },
    });
    res.send(form);
  } else {
    res.send({ message: "Forms Can't Be Edited" });
  }
}
