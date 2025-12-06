import { z } from "zod";

// GET /api/products?bank=&aprMin=&aprMax=&minIncome=&minCreditScore=
export const GetProductsQuerySchema = z
  .object({
    bank: z.string().trim().min(1).optional(),

    aprMin: z
      .coerce
      .number()
      .min(0)
      .optional(),

    aprMax: z
      .coerce
      .number()
      .min(0)
      .optional(),

    minIncome: z
      .coerce
      .number()
      .min(0)
      .optional(),

    minCreditScore: z
      .coerce
      .number()
      .min(0)
      .max(900)
      .optional(),
  })
  .refine(
    (data) =>
      data.aprMin === undefined ||
      data.aprMax === undefined ||
      data.aprMin <= data.aprMax,
    {
      message: "aprMin must be <= aprMax",
      path: ["aprMin"],
    }
  );

export type GetProductsQuery = z.infer<typeof GetProductsQuerySchema>;
