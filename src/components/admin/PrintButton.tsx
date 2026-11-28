'use client';

export default function PrintButton({ label = 'Imprimer' }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex min-h-[44px] items-center rounded-full border border-gn-ink/25 px-5 text-sm font-semibold text-gn-ink transition-colors hover:border-gn-ink/50 print:hidden"
    >
      {label}
    </button>
  );
}
