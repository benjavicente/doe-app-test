import * as yup from "yup";

export const createInitiativeSchema = yup.object({
  name: yup.string().required(),
  slug: yup
    .string()
    .required()
    .matches(/[\w\-]{3,}/),
  description: yup.object({}),
  universities: yup.array(yup.string().uuid()).min(1).required(),
  countries: yup.array(yup.string().uuid()),
});
