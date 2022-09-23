import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
const multer = require("multer");
import fs from "fs";
import upload from "lib/minio";

type SuccessfulResponse<T> = {
  data: string;
  error?: never;
  statusCode?: number;
};
type UnsuccessfulResponse<E> = { data?: never; error: E; statusCode?: number };
type ApiResponse<T, E = unknown> =
  | SuccessfulResponse<T>
  | UnsuccessfulResponse<E>;

type ResponseData = ApiResponse<string[], string>;

const apiRoute = nextConnect({
  onError(error, req: any, res: NextApiResponse<ResponseData>) {
    res.status(501).json({ error: `Sorry something Happened! ${error}` });
  },
  onNoMatch(req: any, res: NextApiResponse<ResponseData>) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.single("file"));

apiRoute.post((req: any, res: NextApiResponse<ResponseData>) => {
  const url = `${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${process.env.MINIO_BUCKET_NAME}/${req.file.objectName}`;
  res.status(200).json({ data: url });
});

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
export default apiRoute;
