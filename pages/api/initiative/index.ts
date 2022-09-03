import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { UserSession } from "~/lib/auth";
import prisma from "~/lib/prisma";
import { createInitiativeSchema } from "./_schemas";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = (await getSession({ req })) as UserSession;
  if (session && session.user.isAdmin) {
    if (req.method === "POST") {
      try {
        // Validate the slug
        createInitiativeSchema.validate(req.body);
      } catch (error) {
        // Unprocessable Entity
        res.status(422).json({ message: error.errors });
        return;
      }

      const initiative = await prisma.initiative.create({
        data: {
          name: req.body.name,
          slug: req.body.slug,
          description: req.body.description,
          universities: {
            connect: req.body.universities.map((id) => ({ id })),
          },
        },
      });

      // Created
      res.status(201).json(initiative);
    }
  }
}
