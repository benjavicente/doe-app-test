import axios from 'axios';
import { Formik, Form, Field, ErrorMessage, FieldArray, useFormikContext, FormikHelpers } from 'formik';
import { createInitiativeSchema } from "~/pages/api/initiative/_schemas";
import { Country, University } from '@prisma/client';
import TextEditor from '../TextEditor';
import { useEffect, useState } from 'react';
import * as yup from 'yup';
import { JSONContent } from '@tiptap/react';


type SelectListProps<K, V> = {
  values: V[],
  name: string,
  options: K[],
  key?: string,
  value?: string,
  disabled?: boolean
}

function SelectList<K, V>({ values, name, disabled, options, key = "id", value = "name" }: SelectListProps<K, V>) {
  return (
    <div className="flex flex-col gap-2">
      <FieldArray name={name}>
        {({ remove, push, replace }) => (
          <>
            {values.length > 0 && values.map((_, index) => (
              <label key={index} className="w-full flex gap-1">
                <Field name={`${name}.${index}`} type="select" as="select" selected="" onChange={(e) => replace(index, e.target.value)} className="select select-bordered flex-1">
                  <option disabled hidden value="">Selecciona una opción</option>
                  {options.map((option) => values.includes(value[key]) || (
                    <option key={option[key]} value={option[key]}>{option[value]}</option>
                  ))}
                </Field>
                <ErrorMessage name={`${name}.${index}`} />
                <button type="button" className='btn btn-square' onClick={() => remove(index)}>
                  -
                </button>
              </label>
            ))}
            <button type="button" className='btn' disabled={disabled} onClick={() => push("")}>
              añadir
            </button>
          </>
        )}
      </FieldArray>
    </div >
  )
}

function InitiativeFormWithContext<T>({ countries, action }: { countries: Country[], action: string }) {
  const { values, setValues, isValid, isSubmitting, setFieldValue } = useFormikContext<yup.InferType<typeof createInitiativeSchema>>();
  const [universities, setUniversities] = useState<University[]>([]);


  const countriesValues = values.countries.filter((country) => country);
  const shouldHaveUniversities = countriesValues.length > 0;

  useEffect(() => {
    if (countriesValues.length === 0) {
      setUniversities([])
      setValues({ ...values, universities: [] })
      return
    }
    axios.get<University[]>("/api/university", { params: { country: countriesValues } }).then((r) => {
      setUniversities(r.data)
    })
  }, [JSON.stringify(countriesValues)])

  useEffect(() => {
    if (shouldHaveUniversities && values.universities.filter((university) => university).length === 0) {
      setValues({ ...values, universities: [] })
    }
  }, [universities])


  return (
    <Form className='flex flex-col gap-2 p-4 max-w-4xl mx-auto'>
      <label className="label" htmlFor="name">Nombre</label>
      <Field name="name" type="text" className="input input-bordered" />
      <ErrorMessage name='name' />

      <label className="label" htmlFor="slug">Usuario</label>
      <Field name="slug" type="text" className="input input-bordered" />
      <ErrorMessage name='slug' />

      <h2 className="label">Países</h2>
      <SelectList values={values.countries} name="countries" options={countries} />

      <h2 className="label">Universidades</h2>
      <SelectList values={values.universities} name="universities" options={universities} disabled={!shouldHaveUniversities} />

      <h2 className="label">Descripción</h2>
      <TextEditor initialContent={values.description as JSONContent} onChange={(data) => setFieldValue("description", data, false)} />
      <button type="submit" className='btn mt-8' disabled={!isValid || isSubmitting}>
        {action}
      </button>
    </Form>
  )
}

export default function InitiativeForm<T>({ initialValues, countries, onSubmit, action }: InitiativeFormProps<T>) {
  return (
    <div className="mx-auto max-w-4xl">
      <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={createInitiativeSchema} >
        <InitiativeFormWithContext countries={countries} action={action} />
      </Formik>
    </div >
  )
}

type InitiativeFormProps<T> = {
  countries: Country[],
  initialValues: T,
  action: string,
  onSubmit: (values: T, formikHelpers: FormikHelpers<T>) => void
}
