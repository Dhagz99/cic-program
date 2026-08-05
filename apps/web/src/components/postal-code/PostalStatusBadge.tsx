import type {
  PostalAuditStatus
} from "@repo/shared";

type Props = {
  status: PostalAuditStatus;
};

const styles: Record<
  PostalAuditStatus,
  string
> = {
  CORRECT:
    "bg-emerald-100 text-emerald-700",

  MISSING:
    "bg-amber-100 text-amber-700",

  MISMATCH:
    "bg-red-100 text-red-700",

  UNRESOLVED:
    "bg-slate-100 text-slate-700"
};

const labels: Record<
  PostalAuditStatus,
  string
> = {
  CORRECT: "Correct",
  MISSING: "Missing",
  MISMATCH: "Mismatch",
  UNRESOLVED: "Unresolved"
};

export default function PostalStatusBadge({
  status
}: Props) {
  return (
    <span
      className={`
        inline-flex
        rounded-full
        px-3 py-1
        text-xs font-semibold
        ${styles[status]}
      `}
    >
      {labels[status]}
    </span>
  );
}