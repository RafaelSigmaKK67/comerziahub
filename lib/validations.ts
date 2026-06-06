import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter ao menos 6 caracteres"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Informe seu nome completo"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter ao menos 6 caracteres"),
  role: z
    .enum(["CUSTOMER", "STORE_OWNER", "SELLER", "COURIER"])
    .default("CUSTOMER"),
  phone: z.string().optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("E-mail inválido"),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(10),
    password: z.string().min(6, "A senha deve ter ao menos 6 caracteres"),
    confirm: z.string().min(6),
  })
  .refine((d) => d.password === d.confirm, {
    message: "As senhas não conferem",
    path: ["confirm"],
  });

export const storeSchema = z.object({
  name: z.string().min(2, "Informe o nome da loja"),
  segment: z.string().optional(),
  description: z.string().optional(),
  phone: z.string().optional(),
});

export const productSchema = z.object({
  name: z.string().min(2, "Informe o nome do produto"),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  basePrice: z.coerce.number().min(0, "Preço inválido"),
  promoPrice: z.coerce.number().min(0).optional(),
  costPrice: z.coerce.number().min(0).optional(),
  stock: z.coerce.number().min(0).default(0),
  unit: z
    .enum(["UN", "KG", "G", "L", "ML", "PACOTE", "CAIXA", "DUZIA", "METRO", "PORCAO"])
    .default("UN"),
  minQuantity: z.coerce.number().min(0).default(1),
  unitStep: z.coerce.number().min(0).default(1),
  status: z.enum(["ACTIVE", "PAUSED", "OUT_OF_STOCK", "DRAFT"]).default("ACTIVE"),
});

export const addressSchema = z.object({
  label: z.string().optional(),
  recipientName: z.string().optional(),
  phone: z.string().optional(),
  zip: z.string().optional(),
  street: z.string().min(2, "Informe a rua"),
  number: z.string().optional(),
  complement: z.string().optional(),
  district: z.string().optional(),
  city: z.string().min(2, "Informe a cidade"),
  state: z.string().min(2, "Informe o estado"),
});

export const postSchema = z.object({
  content: z.string().min(1, "Escreva algo").max(2000),
  storeId: z.string().optional(),
  productId: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
