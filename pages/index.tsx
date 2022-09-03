import React from "react";
import type { GetServerSideProps } from "next";
import prisma from '~/lib/prisma'
import { Initiative } from '@prisma/client'
import Link from "next/link";

type PageProps = {
  initiatives: Initiative[]
}

export const getServerSideProps: GetServerSideProps<PageProps> = async () => {
  const initiatives = await prisma.initiative.findMany()
  return {
    props: { initiatives },
  };
};


export default function Index({ initiatives }: PageProps) {
  return (
    <div className="page">
      <ul>
        {initiatives.map((initiative) => (
          <li key={initiative.id}>
            <Link href={`/initiative/${initiative.slug}`}>
              <a className="link">
                {initiative.name}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};


