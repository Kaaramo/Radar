"use client";

export type CompanySuggestionChipProps = {
  label: string;
  onSelect: (label: string) => void;
};

/**
 * Chip mono rounded-full pour les suggestions Maroc/Maghreb.
 * Click → préremplit le champ Nom du concurrent dans Step2Form.
 */
export function CompanySuggestionChip({
  label,
  onSelect,
}: CompanySuggestionChipProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(label)}
      className="rounded-full border border-navy-700 bg-navy-800 px-3.5 py-1.5 font-mono text-[13px] font-medium text-muted transition-colors duration-150 ease-out hover:border-royal hover:text-bone"
    >
      {label}
    </button>
  );
}
