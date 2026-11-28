import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin-auth";
import ArrivalToggle from "@/components/admin/ArrivalToggle";
import AutoRefresh from "@/components/admin/AutoRefresh";
import PrintButton from "@/components/admin/PrintButton";
import {
  formatVisitDay,
  formatVisitDayWithYear,
  peopleLabel,
  todayInKinshasa,
  totalPeople,
  visitDateFromValue,
  visitServiceFor,
} from "@/lib/visits";
import { anonymizeOldVisits } from "@/lib/visits-db";

// Feuille d'accueil, dans l'espace admin (une seule connexion pour tout) : qui
// vient à quel culte, combien de personnes, qui est déjà arrivé. Elle ne montre
// ni téléphone, ni e-mail, ni demande de prière : on peut l'imprimer ou la
// poser sur une tablette à l'entrée sans exposer ces informations.
export default async function WelcomeSheetPage({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { date: dateParam } = await searchParams;

  await anonymizeOldVisits();
  const today = todayInKinshasa();
  const grouped = await prisma.visit.groupBy({
    by: ["visitDate"],
    where: { visitDate: { gte: today } },
    orderBy: { visitDate: "asc" },
  });
  const dates = grouped.map((g) => g.visitDate);

  const requested = dateParam ? visitDateFromValue(dateParam) : null;
  const selected = (requested && dates.find((d) => d.getTime() === requested.getTime())) || dates[0] || null;

  const visits = selected
    ? await prisma.visit.findMany({
        where: { visitDate: selected },
        orderBy: { createdAt: "asc" },
        select: { id: true, firstName: true, lastName: true, companions: true, childrenCount: true, companionNames: true, status: true },
      })
    : [];

  const people = visits.reduce((n, v) => n + totalPeople(v), 0);
  const children = visits.reduce((n, v) => n + v.childrenCount, 0);
  const isCame = (status: string) => status === "ARRIVED" || status === "FOLLOWED_UP" || status === "MEMBER";
  const arrived = visits.filter((v) => isCame(v.status)).length;
  const service = selected ? visitServiceFor(selected) : null;

  return (
    <div data-print-sheet className="space-y-4">
      <AutoRefresh />
      <div className="flex flex-wrap items-center gap-3 print:hidden">
        <Link href="/admin/visites" className="inline-flex min-h-[44px] items-center text-sm text-gn-gold underline underline-offset-2">
          ← Retour aux visites
        </Link>
        <PrintButton label="Imprimer la feuille" />
      </div>

      <div className="rounded-2xl bg-gn-cream-bg p-6 text-gn-ink sm:p-8">
        <p className="font-serif text-base italic font-medium text-gn-gold-line">Équipe d&apos;accueil</p>
        <h1 className="mt-1 font-serif text-3xl font-bold leading-tight">Feuille d&apos;accueil</h1>

        {dates.length === 0 || !selected ? (
          <div className="mt-6 rounded-2xl border border-gn-line bg-white p-8 text-center">
            <p className="font-serif text-lg font-semibold">Aucune visite annoncée pour le moment.</p>
            <p className="mt-2 text-sm text-gn-muted-strong">
              Dès que quelqu&apos;un annonce sa venue sur le site, il apparaît ici (la page se met à jour toute seule).
            </p>
          </div>
        ) : (
          <>
            {dates.length > 1 && (
              <nav aria-label="Jour du culte" className="mt-5 flex flex-wrap gap-2 print:hidden">
                {dates.map((d) => {
                  const value = d.toISOString().slice(0, 10);
                  const current = d.getTime() === selected.getTime();
                  return (
                    <Link
                      key={value}
                      href={`/admin/visites/accueil?date=${value}`}
                      aria-current={current ? "page" : undefined}
                      className={`inline-flex min-h-[44px] items-center rounded-full border px-4 text-sm font-semibold transition-colors ${
                        current ? "border-gn-gold-dark bg-gn-gold-dark text-white" : "border-gn-ink/25 text-gn-ink hover:border-gn-ink/50"
                      }`}
                    >
                      {formatVisitDay(d)}
                    </Link>
                  );
                })}
              </nav>
            )}

            <h2 className="mt-6 font-serif text-2xl font-semibold capitalize">
              {formatVisitDayWithYear(selected)}
              {service && <span className="font-sans text-base font-normal normal-case text-gn-muted-strong"> · {service.label}, {service.time}</span>}
            </h2>

            <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Visites", value: visits.length },
                { label: "Personnes", value: people },
                { label: "Dont enfants", value: children },
                { label: "Déjà arrivés", value: `${arrived} / ${visits.length}` },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-gn-line bg-white p-4">
                  <dt className="text-xs font-semibold text-gn-muted-strong">{item.label}</dt>
                  <dd className="mt-1 font-serif text-2xl font-bold">{item.value}</dd>
                </div>
              ))}
            </dl>

            <ul className="mt-6 divide-y divide-gn-line rounded-2xl border border-gn-line bg-white">
              {visits.map((v) => (
                <li key={v.id} className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5">
                  <div className="min-w-0">
                    <p className="font-serif text-lg font-semibold">
                      {v.firstName} {v.lastName}
                    </p>
                    <p className="text-sm text-gn-muted-strong">{peopleLabel(v)}</p>
                    {v.companionNames && <p className="mt-1 text-sm text-gn-ink/80">Avec : {v.companionNames}</p>}
                    {v.status === "NO_SHOW" && <p className="mt-1 text-xs font-semibold text-gn-muted-strong">Marqué « pas venu »</p>}
                  </div>
                  <ArrivalToggle id={v.id} arrived={isCame(v.status)} locked={v.status === "FOLLOWED_UP" || v.status === "MEMBER"} />
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-gn-muted-strong">
              Ces informations sont réservées à l&apos;équipe d&apos;accueil : ne pas les partager ni les laisser à la vue.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
