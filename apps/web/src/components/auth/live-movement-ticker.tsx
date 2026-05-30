"use client";

import { useEffect, useState } from "react";
import {
  Cpu,
  Compass,
  UsersRound,
  Megaphone,
  ShieldCheck,
  Star,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Axe = "TECH" | "STRATEGIE" | "RH" | "DIGITAL" | "REGLEMENTATION";

type MockMovement = {
  id: string;
  axe: Axe;
  axeLabel: string;
  axeIcon: LucideIcon;
  axeColor: string;
  axeColorRgba: string;
  concurrent: string;
  titre: string;
  source: string;
  craap: number;
  timeAgo: string;
  validated: boolean;
};

const AXE_META: Record<
  Axe,
  { label: string; icon: LucideIcon; color: string; rgba: string }
> = {
  TECH: {
    label: "TECH",
    icon: Cpu,
    color: "#2251FF",
    rgba: "rgba(34, 81, 255, 0.15)",
  },
  STRATEGIE: {
    label: "STRATÉGIE",
    icon: Compass,
    color: "#C77700",
    rgba: "rgba(199, 119, 0, 0.15)",
  },
  RH: {
    label: "RH",
    icon: UsersRound,
    color: "#4A1D6E",
    rgba: "rgba(74, 29, 110, 0.15)",
  },
  DIGITAL: {
    label: "DIGITAL",
    icon: Megaphone,
    color: "#EC4899",
    rgba: "rgba(236, 72, 153, 0.15)",
  },
  REGLEMENTATION: {
    label: "RÉGLEMENTATION",
    icon: ShieldCheck,
    color: "#0F8F65",
    rgba: "rgba(15, 143, 101, 0.15)",
  },
};

const buildMovement = (
  id: string,
  axe: Axe,
  concurrent: string,
  titre: string,
  source: string,
  craap: number,
  timeAgo: string,
  validated = true,
): MockMovement => {
  const meta = AXE_META[axe];
  return {
    id,
    axe,
    axeLabel: meta.label,
    axeIcon: meta.icon,
    axeColor: meta.color,
    axeColorRgba: meta.rgba,
    concurrent,
    titre,
    source,
    craap,
    timeAgo,
    validated,
  };
};

const MOCKS: MockMovement[] = [
  buildMovement(
    "m1",
    "STRATEGIE",
    "Inwi",
    "Inwi nomme un nouveau Directeur Stratégie pour piloter la transformation 5G",
    "medias24.com",
    8.4,
    "il y a 2h 14",
  ),
  buildMovement(
    "m2",
    "STRATEGIE",
    "Roland Berger Maroc",
    "Roland Berger Maroc rachète le cabinet Strategy & North Africa",
    "challenge.ma",
    8.6,
    "il y a 4h 02",
  ),
  buildMovement(
    "m3",
    "TECH",
    "Wafa Salaf",
    "Wafa Salaf migre son back-office vers une stack TypeScript full-stack",
    "blog.wafasalaf.ma",
    6.4,
    "il y a 6h 41",
    false,
  ),
  buildMovement(
    "m4",
    "RH",
    "Maroc Telecom",
    "Maroc Telecom recrute 23 ingénieurs cybersécurité avant T2",
    "linkedin.com",
    7.8,
    "il y a 8h 17",
  ),
  buildMovement(
    "m5",
    "DIGITAL",
    "Cosumar",
    "Cosumar lance une campagne LinkedIn sur sa nouvelle marque sucre bio",
    "cosumar.co.ma",
    7.1,
    "il y a 11h 33",
  ),
];

const CYCLE_MS = 5000;

export function LiveMovementTicker() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % MOCKS.length);
    }, CYCLE_MS);
    return () => clearInterval(id);
  }, []);

  const m = MOCKS[index]!;
  const Icon = m.axeIcon;

  // CRAAP score color
  const craapColor =
    m.craap >= 8
      ? "#2251FF"
      : m.craap >= 6
        ? "#0F8F65"
        : m.craap >= 4
          ? "#C77700"
          : "#B42318";

  return (
    <div className="relative overflow-hidden">
      {/* Header micro-label */}
      <div className="mb-3 flex items-center gap-2.5">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border-strong to-transparent" />
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-muted-soft">
          Détection en cours
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border-strong to-transparent" />
      </div>

      {/* Card avec animation re-mount à chaque tick */}
      <div
        key={m.id}
        className="ticker-in relative rounded-xl border border-navy-700 bg-navy-800/80 p-4 backdrop-blur-sm"
        style={{
          borderLeftWidth: "3px",
          borderLeftColor: m.validated ? "#2251FF" : "#1F4868",
        }}
      >
        {/* Header : axe + concurrent + timestamp + craap */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.08em]"
              style={{ backgroundColor: m.axeColorRgba, color: m.axeColor }}
            >
              <Icon size={11} strokeWidth={1.8} />
              {m.axeLabel}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md bg-navy-900 px-2 py-1 text-[12px] font-medium text-bone">
              <span
                className="flex size-3.5 items-center justify-center rounded-full bg-navy text-[8px] font-semibold uppercase"
                style={{ color: m.axeColor }}
              >
                {m.concurrent[0]}
              </span>
              <span className="truncate">{m.concurrent}</span>
            </span>
          </div>

          {/* CRAAP score */}
          <div
            className="flex shrink-0 flex-col items-center gap-0.5 rounded-md border px-2 py-1"
            style={{
              borderColor: craapColor + "55",
              backgroundColor: craapColor + "10",
            }}
            aria-label={`Score CRAAP : ${m.craap.toFixed(1)} sur 10`}
          >
            <span
              className="font-mono text-[14px] font-bold"
              style={{ color: craapColor }}
            >
              {m.craap.toFixed(1)}
            </span>
            <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-muted-soft">
              CRAAP
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="mt-3 text-[14px] font-semibold leading-[1.35] text-bone">
          {m.titre}
        </h3>

        {/* Source + timestamp */}
        <div className="mt-3 flex items-center justify-between gap-3 border-t border-navy-700 pt-3">
          <div className="flex min-w-0 items-center gap-1.5 truncate">
            {m.validated && (
              <Star
                size={10}
                fill="#2251FF"
                strokeWidth={0}
                aria-hidden="true"
              />
            )}
            <span className="truncate font-mono text-[11px] text-muted-soft">
              {m.source}
            </span>
          </div>
          <span className="shrink-0 font-mono text-[11px] text-muted-soft">
            {m.timeAgo}
          </span>
        </div>
      </div>

      {/* Progress dots (ticker indicator) */}
      <div className="mt-3 flex justify-center gap-1.5" aria-hidden="true">
        {MOCKS.map((mock, i) => (
          <span
            key={mock.id}
            className="h-0.5 rounded-full transition-all duration-500"
            style={{
              width: i === index ? "20px" : "8px",
              backgroundColor: i === index ? "#2251FF" : "#1F4868",
            }}
          />
        ))}
      </div>
    </div>
  );
}
