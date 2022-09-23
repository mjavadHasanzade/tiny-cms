import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { minioClient } from "lib/minio";
import auth from "middlewares/auth";

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE")
    return res.status(400).send({ message: "Incorrect Method" });

  const isAuth = auth(req, res);
  if (!isAuth) return res.status(401).send({ message: "Access Denied !!!" });

  const objetName = req.query.objetName;
  console.log(objetName);

  minioClient.removeObject("default", objetName, function (err: any) {
    console.log(err);
    if (err) res.send({ message: "Error Deleting Object" });

    res.send({ message: "Object Deleted Successfully" });
  });
}
