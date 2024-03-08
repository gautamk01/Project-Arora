import * as z from "zod";

export const FormSchema = z.object({
  name: z.string().min(2, { message: "Agency name must be atleast 2 chars." }),
  companyEmail: z.string().email(),
  companyPhone: z.string().regex(/^\+?[0-9]{10,14}$/),
  whiteLabel: z.boolean(),
  address: z.string().min(1),
  city: z.string().min(1),
  zipCode: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1),
  agencyLogo: z.string().min(1),
});
