// Contrats Zod des callbacks OpenClaw → Next.js (cf. KARAMO.md)
// Importés par apps/web (validation côté serveur Next.js) ET par apps/agent
// (typage des payloads sortants pour éviter les "champ manquant" silencieux).

export * from "./profil";
export * from "./rapport";
export * from "./sources";
export * from "./swot";
export * from "./pestel";
export * from "./signaux";

// Type union pour le routeur côté Next.js (1 endpoint discriminé possible en V2)
import type { ProfilEvent } from "./profil";
import type {
  RapportProgresseEvent,
  RapportTermineEvent,
  RapportEchecEvent,
} from "./rapport";
import type { SourcesEvent } from "./sources";
import type { SwotEvent } from "./swot";
import type { PestelEvent } from "./pestel";
import type { SignauxEvent } from "./signaux";

export type InternalEvent =
  | ProfilEvent
  | RapportProgresseEvent
  | RapportTermineEvent
  | RapportEchecEvent
  | SourcesEvent
  | SwotEvent
  | PestelEvent
  | SignauxEvent;
