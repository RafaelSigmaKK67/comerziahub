"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { randomUUID } from "crypto";

import { signIn, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
} from "@/lib/validations";
import type { ActionState } from "@/types";

export async function loginAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return {
      error: "Dados inválidos.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const callbackUrl = (formData.get("callbackUrl") as string) || "/continue";

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: callbackUrl,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "E-mail ou senha incorretos." };
    }
    throw error; // NEXT_REDIRECT
  }
  return {};
}

export async function registerAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role") ?? "CUSTOMER",
    phone: formData.get("phone") ?? undefined,
  });
  if (!parsed.success) {
    return {
      error: "Verifique os campos destacados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { name, email, password, role, phone } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (existing) {
    return { error: "Já existe uma conta com este e-mail." };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email: normalizedEmail, passwordHash, role, phone },
  });

  // Cria o perfil de entregador automaticamente.
  if (role === "COURIER") {
    await prisma.courierProfile.create({ data: { userId: user.id } });
  }

  try {
    await signIn("credentials", {
      email: normalizedEmail,
      password,
      redirectTo: "/continue",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Conta criada. Faça login para continuar." };
    }
    throw error; // NEXT_REDIRECT
  }
  return {};
}

export async function forgotPasswordAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });
  if (!parsed.success) return { error: "E-mail inválido." };

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });

  // Sempre criamos o token silenciosamente (não revelamos se o e-mail existe).
  if (user) {
    const token = `${randomUUID()}${randomUUID()}`.replace(/-/g, "");
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expires: new Date(Date.now() + 60 * 60 * 1000),
      },
    });
    // TODO(roadmap): enviar e-mail com link /reset-password?token=...
  }

  return {
    success: true,
    message:
      "Se houver uma conta com este e-mail, enviaremos instruções de recuperação.",
  };
}

export async function logout() {
  await signOut({ redirectTo: "/" });
}
