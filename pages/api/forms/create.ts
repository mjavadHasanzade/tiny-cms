import prisma from "../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import auth from "../../../middlewares/auth";
import { Prisma } from "@prisma/client";

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.body.name !== "contact") {
    const isAuth = auth(req, res);
    if (!isAuth) return res.status(401).send({ message: "Access Denied !!!" });
  }
  // req.body = JSON.parse(req.body);

  try {
    const { name, description, fields } = req.body;

    const form = await prisma.forms.create({
      data: req.body,
    });

    res.send({ message: "Form Created Successfully", name: form.name });
  } catch (error) {
    res.send({ message: "Form Did'nt Create! Something Went Wrong", error });
  }
}
