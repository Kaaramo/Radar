import { z } from "zod";

export const emailSchema = z
  .string({ required_error: "Email requis" })
  .min(1, "Email requis")
  .email({ message: "Format d'email invalide" })
  .toLowerCase();

export const passwordSchema = z
  .string({ required_error: "Mot de passe requis" })
  .min(8, "Min. 8 caractères")
  .max(128, "Mot de passe trop long")
  .regex(/[A-Z]/, "Au moins 1 majuscule")
  .regex(/\d/, "Au moins 1 chiffre");

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Mot de passe requis"),
});

export const registerSchema = z.object({
  name: z
    .string({ required_error: "Nom complet requis" })
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères"),
  email: emailSchema,
  password: passwordSchema,
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Token requis"),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
