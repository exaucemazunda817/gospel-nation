import Link from "next/link";
import { redirect } from "next/navigation";
import PrintButton from "@/components/admin/PrintButton";
import { isAdmin } from "@/lib/admin-auth";
import { church } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

// Affiche à imprimer ou à projeter à l'église : un QR code vers la page
// « Première visite ». Le QR est généré à chaque déploiement avec l'adresse
// NEXT_PUBLIC_SITE_URL du site.
export default async function VisitPosterPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const shown = SITE_URL.replace(/^https?:\/\//, "");
  return (
    <div data-print-sheet className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 print:hidden">
        <Link href="/admin/visites" className="inline-flex min-h-[44px] items-center text-sm text-gn-gold underline underline-offset-2">
          ← Retour aux visites
        </Link>
        <PrintButton label="Imprimer l'affiche" />
        <a
          href="/visite/qr"
          download="qr-premiere-visite.svg"
          className="inline-flex min-h-[44px] items-center rounded-full border border-gn-ink/25 bg-gn-cream-bg px-5 text-sm font-semibold text-gn-ink transition-colors hover:border-gn-ink/50"
        >
          Télécharger le QR (SVG)
        </a>
      </div>
      <div className="mx-auto max-w-xl rounded-2xl bg-white p-10 text-center text-gn-ink">
        <p className="font-serif text-base italic font-medium text-gn-gold-line">{church.name}</p>
        <h1 className="mt-2 font-serif text-4xl font-bold leading-tight">Première visite ?</h1>
        <p className="mx-auto mt-3 max-w-sm text-lg">Scannez ce code pour annoncer votre venue : nous serons heureux de vous accueillir.</p>
        {/* Image dynamique générée par /visite/qr : next/image n'apporterait rien à un SVG. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/visite/qr" alt={`QR code vers la page Première visite : ${shown}/visite`} width={360} height={360} className="mx-auto mt-6 h-auto w-full max-w-[360px]" />
        <p className="mt-4 text-sm text-gn-muted-strong">ou rendez-vous sur {shown}/visite</p>
      </div>
      <p className="text-xs text-gn-cream/60 print:hidden">
        Le QR code pointe vers {SITE_URL}/visite. Si l&apos;adresse du site change, redéployez le site puis réimprimez l&apos;affiche.
      </p>
    </div>
  );
}
