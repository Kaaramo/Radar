"use client";

import { Download } from "lucide-react";

/**
 * Bouton de téléchargement du rapport au format Markdown (.md), généré côté
 * client via un Blob (aucun aller-retour serveur).
 */
export function DownloadMdButton({
  markdown,
  filename,
}: {
  markdown: string;
  filename: string;
}) {
  const onClick = () => {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename.endsWith(".md") ? filename : `${filename}.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-9 items-center gap-2 rounded-md border border-navy-700 px-3 text-[12.5px] font-medium text-muted transition-colors hover:border-royal/40 hover:text-bone"
    >
      <Download size={14} strokeWidth={1.6} />
      Télécharger .md
    </button>
  );
}
