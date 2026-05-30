import { z } from "zod";
import { AXES_KEYS } from "@/lib/onboarding/axes";

const URL_REGEX = /^https?:\/\/.+\..+/;

export const urlSchema = z
  .string({ required_error: "Site internet requis" })
  .min(1, "Site internet requis")
  .regex(URL_REGEX, {
    message: "Format d'URL invalide. Ex : https://www.exemple.ma",
  });

export const optionalUrlSchema = z
  .string()
  .optional()
  .transform((v) => (v && v.trim().length > 0 ? v.trim() : undefined))
  .refine((v) => !v || URL_REGEX.test(v), {
    message: "Format d'URL invalide. Ex : https://www.exemple.ma",
  });

export const step1EntrepriseSchema = z.object({
  nomEntreprise: z
    .string({ required_error: "Nom d'entreprise requis" })
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(120, "Le nom ne peut pas dépasser 120 caractères"),
  siteWeb: urlSchema,
});

export const step2ConcurrentSchema = z.object({
  nom: z
    .string({ required_error: "Nom du concurrent requis" })
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(120, "Le nom ne peut pas dépasser 120 caractères"),
  siteWeb: optionalUrlSchema,
});

export const step3AxesSchema = z.object({
  axes: z
    .array(z.enum(AXES_KEYS))
    .min(1, "Sélectionnez au moins 1 axe")
    .max(AXES_KEYS.length),
});

export type Step1EntrepriseInput = z.infer<typeof step1EntrepriseSchema>;
export type Step2ConcurrentInput = z.infer<typeof step2ConcurrentSchema>;
export type Step3AxesInput = z.infer<typeof step3AxesSchema>;
