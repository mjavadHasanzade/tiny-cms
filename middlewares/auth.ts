import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

const auth = (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.headers["xauth"];
  if (!token) return null;

  try {
    const user = jwt.verify(String(token), "tinyCmsJwtKey");
    //@ts-ignore
    req.user = user;
    return req;
  } catch (ex) {
    return null;
  }
};

export default auth;
