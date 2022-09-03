import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { UserSession } from "~/lib/auth";
import prisma from "~/lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = (await getSession({ req })) as UserSession;
  if (session && session.user.isAdmin) {
    if (req.method === "POST") {
      const user = await prisma.user.update({
        where: { id: +req.query.userId },
        data: { isAdmin: true },
      });
      return res.status(200).json(user);
    } else if (req.method === "DELETE") {
      const user = await prisma.user.update({
        where: { id: +req.query.userId },
        data: { isAdmin: false },
      });
      return res.status(200).json(user);
    }
  }
  // Invalid request
  res.status(400).json({ message: "Invalid request" });
}
