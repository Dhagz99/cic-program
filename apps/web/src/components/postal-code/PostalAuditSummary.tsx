import {
  CheckCircle2,
  CircleHelp,
  MapPinOff,
  TriangleAlert,
  Users
} from "lucide-react";

import type {
  ClientPostalAuditSummary
} from "@repo/shared";

type Props = {
  summary: ClientPostalAuditSummary;
};

export default function PostalAuditSummary({
  summary
}: Props) {
  const cards = [
    {
      label: "Total Clients",
      value: summary.total,
      icon: Users,
      className:
        "bg-blue-50 text-blue-600"
    },
    {
      label: "Correct",
      value: summary.correct,
      icon: CheckCircle2,
      className:
        "bg-emerald-50 text-emerald-600"
    },
    {
      label: "Missing",
      value: summary.missing,
      icon: CircleHelp,
      className:
        "bg-amber-50 text-amber-600"
    },
    {
      label: "Mismatch",
      value: summary.mismatch,
      icon: TriangleAlert,
      className:
        "bg-red-50 text-red-600"
    },
    {
      label: "Unresolved",
      value: summary.unresolved,
      icon: MapPinOff,
      className:
        "bg-slate-100 text-slate-600"
    }
  ];

  return (
    <div
      className="
        grid gap-4
        sm:grid-cols-2
        xl:grid-cols-5
      "
    >
      {cards.map((card) => {
        const Icon =
          card.icon;

        return (
          <div
            key={card.label}
            className="
              flex items-center
              justify-between
              rounded-2xl
              border border-slate-200
              bg-white p-5
              shadow-sm
            "
          >
            <div>
              <p
                className="
                  text-sm
                  text-slate-500
                "
              >
                {card.label}
              </p>

              <p
                className="
                  mt-2 text-2xl
                  font-semibold
                  text-slate-900
                "
              >
                {card.value}
              </p>
            </div>

            <div
              className={`
                flex h-11 w-11
                items-center justify-center
                rounded-xl
                ${card.className}
              `}
            >
              <Icon className="h-5 w-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
}