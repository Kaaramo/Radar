import {
  Compass,
  Cpu,
  Megaphone,
  Shield,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

export const AXES_KEYS = [
  "RECRUTEMENT_RH",
  "STRATEGIE_DIRECTION",
  "TECHNOLOGIE_INNOVATION",
  "PRESENCE_DIGITALE",
  "REGLEMENTATION_CONFORMITE",
] as const;

export type AxeKey = (typeof AXES_KEYS)[number];

export type Axe = {
  key: AxeKey;
  title: string;
  color: string;
  icon: LucideIcon;
  description: string;
  example: string;
};

export const AXES: readonly Axe[] = [
  {
    key: "RECRUTEMENT_RH",
    title: "Recrutements et RH",
    color: "#4A1D6E",
    icon: UsersRound,
    description:
      "Embauches stratégiques, pages carrières actives, offres d'emploi clés.",
    example: "« Cabinet X recrute un Directeur Stratégie senior »",
  },
  {
    key: "STRATEGIE_DIRECTION",
    title: "Stratégie et direction",
    color: "#C77700",
    icon: Compass,
    description:
      "Levées de fonds, fusions, nominations, partenariats stratégiques.",
    example: "« Concurrent Y annonce une levée de 5 M USD »",
  },
  {
    key: "TECHNOLOGIE_INNOVATION",
    title: "Technologie et innovation",
    color: "#2251FF",
    icon: Cpu,
    description: "Stack technique exposée, brevets, R&D, blogs techniques.",
    example: "« Concurrent Z migre vers une stack TypeScript full-stack »",
  },
  {
    key: "PRESENCE_DIGITALE",
    title: "Présence digitale",
    color: "#BE185D",
    icon: Megaphone,
    description: "Refonte site, campagnes marketing, présence réseaux sociaux.",
    example: "« Concurrent W lance une campagne LinkedIn ciblée »",
  },
  {
    key: "REGLEMENTATION_CONFORMITE",
    title: "Réglementation et conformité",
    color: "#0F8F65",
    icon: Shield,
    description: "Certifications obtenues, litiges, registres légaux, RGPD.",
    example: "« Concurrent V obtient sa certification ISO 27001 »",
  },
];
