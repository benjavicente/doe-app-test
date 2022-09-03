import { Country, Initiative, University } from "@prisma/client";
import { JSONContent } from "@tiptap/react";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import TextEditor from "~/components/TextEditor";
import { UserSession } from "~/lib/auth";
import prisma from "~/lib/prisma";

export default function InitiativePage({ initiative }: PageProps) {
  const { data, status } = useSession();

  return (
    <div className="page">
      <h1>{initiative.name}</h1>
      {initiative.universities.map((university) => (
        <div key={university.id}>
          <h2>{university.name} ({university.country.name})</h2>
        </div>
      ))}
      <TextEditor readOnly initialContent={initiative.description as JSONContent} />
      {status === "authenticated" && (data as UserSession).user.isAdmin && (
        <div className="flex justify-center">
          <Link href={`/initiative/${initiative.slug}/edit`}>
            <a className="btn">Editar</a>
          </Link>
        </div>
      )}
    </div>
  );
}

type PageProps = {
  initiative: Initiative & {
    universities: (University & { country: Country })[]
  }
}

export const getServerSideProps: GetServerSideProps<PageProps> = async ({ query }) => {
  const initiative = await prisma.initiative.findFirst({
    where: {
      slug: query.initiativeSlug as string
    },
    include: {
      universities: {
        include: {
          country: true
        }
      }
    }
  })

  if (!initiative) {
    return {
      notFound: true
    }
  }
  return {
    props: {
      initiative
    }
  }
}
