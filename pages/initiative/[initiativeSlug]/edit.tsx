import { Country, Initiative, University } from "@prisma/client"
import axios from "axios";
import { GetServerSideProps } from "next"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router";
import { useMemo } from "react";
import InitiativeForm from "~/components/forms/initiative";
import { UserSession } from "~/lib/auth";
import prisma from "~/lib/prisma"

export default function InitiativeEditPage({ initiative, countries }: PageProps) {
  const router = useRouter();
  const { data, status } = useSession();

  const initialValues = useMemo(
    () => {
      const selectedCountries = initiative.universities.map(c => c.countryId).filter((v, i, s) => s.indexOf(v) === i);
      return {
        name: initiative.name,
        slug: initiative.slug,
        description: initiative.description,
        countries: selectedCountries,
        universities: initiative.universities.map(u => u.id),
        tags: initiative.tags,
      }
    }, [initiative]
  )
  console.log(initialValues)

  if (status === "loading") {
    return <div>Cargando...</div>;
  }
  if (status === "unauthenticated" || (!data || !(data as UserSession).user.isAdmin)) {
    router.push("/");
    console.log("No eres admin");
    return <div>Redirigiendo...</div>;
  }

  const onSubmit = (values, { setSubmitting }) => {
    setSubmitting(true);
    axios.patch(`/api/initiative/${initiative.slug}`, values).then((r) => {
      setSubmitting(false);
      router.push(`/initiative/${r.data.slug}`)
    }).finally(() => {
      setSubmitting(false);
    })
  }


  return (
    <div>
      <h1 className='text-center text-3xl'>Editando {initiative.name}</h1>
      <InitiativeForm countries={countries} initialValues={initialValues} onSubmit={onSubmit} action="Guardar" />
    </div>
  );
}

type PageProps = {
  countries: Country[],
  initiative: Initiative & {
    universities: (University & { country: Country })[]
  },
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
  console.log(query.initiativeSlug);

  if (!initiative) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      initiative,
      countries: await prisma.country.findMany()
    }
  }
}
