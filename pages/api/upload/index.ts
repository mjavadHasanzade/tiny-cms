import { NextApiResponse } from "next";
import nextConnect from "next-connect";
const multer = require("multer");
import upload from "lib/minio";
import auth from "middlewares/auth";

type SuccessfulResponse<T> = {
  data: string;
  error?: never;
  statusCode?: number;
};
type UnsuccessfulResponse<E> = { data?: never; error: E; statusCode?: number };

const apiRoute = nextConnect({
  onError(error, req: any, res: NextApiResponse) {
    res.status(501).json({ message: `Sorry something Happened! ${error}` });
  },
  onNoMatch(req: any, res: NextApiResponse) {
    res.status(405).json({ message: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.single("file"));

apiRoute.post((req: any, res: NextApiResponse) => {
  const isAuth = auth(req, res);
  if (!isAuth) return res.status(401).send({ message: "Access Denied !!!" });
  const url = `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${process.env.MINIO_BUCKET_NAME}/${req.file.objectName}`;
  res.status(200).json({ url, message: "Image Uploaded Successfully" });
});

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
export default apiRoute;
