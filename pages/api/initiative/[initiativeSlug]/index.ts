import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { UserSession } from "~/lib/auth";
import prisma from "~/lib/prisma";
import { createInitiativeSchema } from "../_schemas";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = (await getSession({ req })) as UserSession;
  if (session && session.user.isAdmin) {
    if (req.method === "PATCH") {
      try {
        // Validate the slug
        createInitiativeSchema.validate(req.body);
      } catch (error) {
        // Unprocessable Entity
        res.status(422).json({ message: error.errors });
        return;
      }

      const initiative = await prisma.initiative.update({
        where: { slug: req.query.initiativeSlug as string },
        data: {
          name: req.body.name,
          slug: req.body.slug,
          description: req.body.description,
          universities: {
            connect: req.body.universities.map((id) => ({ id })),
          },
        },
      });

      // Updated
      res.status(200).json(initiative);
    }
  }
}
