import { notFound } from "next/navigation";

import { ReportPrint } from "@/components/dashboard/report-print";
import { getReport } from "@/lib/dashboard/queries";
import { getOnboardingState } from "@/lib/onboarding/state";

type Params = { id: string };

export const metadata = {
  title: "RADAR · Rapport PDF",
};

/**
 * Route d'impression PDF d'un rapport (standalone, sans AppShell).
 *
 * Le layout (app) protège l'accès (auth + onboarding) sans imposer de chrome,
 * donc cette page rend une vue plein écran prête à imprimer. Le composant
 * client ouvre automatiquement la boîte « Enregistrer en PDF » du navigateur.
 */
export default async function ReportPrintPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const [state, { id }] = await Promise.all([getOnboardingState(), params]);
  const entreprise = state.profil?.nomEntreprise ?? "Votre entreprise";
  const report = await getReport(id, state.userId);

  if (!report) notFound();

  return (
    <ReportPrint
      entreprise={entreprise}
      concurrentNom={report.concurrentNom}
      concurrentSecteur={report.concurrentSecteur}
      semaine={report.semaine}
      genereLe={report.genereLe}
      sourceCount={report.sourceCount}
      signalCount={report.signalCount}
      synthese={report.synthese}
      rapportId={report.rapportId}
    />
  );
}
