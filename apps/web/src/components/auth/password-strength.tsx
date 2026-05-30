/**
 * Indicateur de force du mot de passe : 4 segments horizontaux qui
 * s'allument progressivement selon le score (0..4).
 */

const SEGMENT_COLORS = ["#B42318", "#C77700", "#C77700", "#0F8F65"] as const;

export function scorePassword(pw: string): number {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (pw.length >= 12 || /[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(score, 4);
}

export type PasswordStrengthProps = {
  password: string;
};

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const score = scorePassword(password);
  return (
    <div className="mt-2" aria-hidden="true">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="h-1 flex-1 rounded-sm transition-colors duration-200 ease-out"
            style={{
              backgroundColor: i < score ? SEGMENT_COLORS[i] : "#1F4868",
            }}
          />
        ))}
      </div>
      <div className="mt-2 text-[13px] leading-[1.4] text-muted-soft">
        Min. 8 caractères, 1 majuscule, 1 chiffre
      </div>
    </div>
  );
}
