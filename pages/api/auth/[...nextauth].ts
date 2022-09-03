import { NextApiHandler } from "next";
import NextAuth from "next-auth";

import { options } from "~/lib/auth";

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);
export default authHandler;
