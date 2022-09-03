import prisma from '~/lib/prisma';
import { Country } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/router';
import InitiativeForm from '~/components/forms/initiative';
import { GetServerSideProps } from 'next';


const initialValues = {
  name: '',
  slug: '',
  description: {},
  universities: [],
  countries: [""],
  tags: [],
}

export default function CreateInitiativePage({ countries }: PageProps) {
  const router = useRouter();
  const onSubmit = (values, { setSubmitting }) => {
    setSubmitting(true);
    axios.post("/api/initiative", values).then((r) => {
      setSubmitting(false);
      router.push(`/initiative/${r.data.slug}`)
    }).finally(() => {
      setSubmitting(false);
    })
  }

  return (
    <div>
      <h1 className='text-center text-3xl'>Crear iniciativa</h1>
      <InitiativeForm countries={countries} initialValues={initialValues} onSubmit={onSubmit} action="Crear" />
    </div>
  );
}

type PageProps = {
  countries: Country[]
}

export const getServerSideProps: GetServerSideProps<PageProps> = async () => {
  return {
    props: {
      countries: await prisma.country.findMany()
    }
  }
}
