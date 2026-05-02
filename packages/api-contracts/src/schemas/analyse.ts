import { z } from 'zod';

export const SWOTSchema = z.object({
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  opportunities: z.array(z.string()),
  threats: z.array(z.string()),
});
export type SWOT = z.infer<typeof SWOTSchema>;

export const PESTELSchema = z.object({
  political: z.array(z.string()),
  economic: z.array(z.string()),
  social: z.array(z.string()),
  technological: z.array(z.string()),
  environmental: z.array(z.string()),
  legal: z.array(z.string()),
});
export type PESTEL = z.infer<typeof PESTELSchema>;

export const SignalFaibleSchema = z.object({
  description: z.string(),
  intensite: z.enum(['faible', 'moyenne', 'forte']),
  horizon: z.enum(['court', 'moyen', 'long']),
  sources: z.array(z.string().uuid()),
});
export type SignalFaible = z.infer<typeof SignalFaibleSchema>;
