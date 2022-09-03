import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "~/lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const countriesIds = req.query["country[]"] as string[];
  const universities = await prisma.university.findMany({
    take: 100,
    where: {
      country: {
        id: {
          in: countriesIds,
        },
      },
    },
  });
  res.status(202).json(universities);
}
