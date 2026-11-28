import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin-auth";
import VisitActions from "@/components/admin/VisitActions";
import {
  VISIT_STATUS_LABELS,
  formatVisitDay,
  formatVisitDayWithYear,
  peopleLabel,
  sourceLabel,
  teamSummaryMessage,
  todayInKinshasa,
  totalPeople,
  visitServiceFor,
  whatsappUrl,
} from "@/lib/visits";
import { VISIT_RETENTION_DAYS, anonymizeOldVisits } from "@/lib/visits-db";

const CAME = ["ARRIVED", "FOLLOWED_UP", "MEMBER"];
const button =
  "inline-flex min-h-[44px] items-center rounded-full border border-gn-cream/25 px-4 text-sm font-semibold text-gn-cream/80 transition-colors hover:border-gn-gold hover:text-gn-gold";

export default async function AdminVisitsPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  await anonymizeOldVisits();

  const today = todayInKinshasa();
  const since = new Date(today.getTime() - 365 * 86400_000);
  const recentLimit = new Date(today.getTime() - 60 * 86400_000);

  // Volume faible (quelques dizaines par mois) : on lit une année et on compte ici.
  const all = await prisma.visit.findMany({
    where: { visitDate: { gte: since } },
    orderBy: [{ visitDate: "asc" }, { createdAt: "asc" }],
  });

  const upcoming = all.filter((v) => v.visitDate >= today);
  const recentPast = all.filter((v) => v.visitDate < today && v.visitDate >= recentLimit && v.firstName !== "").reverse();

  const upcomingByDate = new Map<number, typeof upcoming>();
  for (const v of upcoming) {
    const key = v.visitDate.getTime();
    upcomingByDate.set(key, [...(upcomingByDate.get(key) ?? []), v]);
  }

  // Statistiques pour le pasteur : seulement les jours déjà passés.
  const past = all.filter((v) => v.visitDate < today);
  const came = past.filter((v) => CAME.includes(v.status));
  const members = past.filter((v) => v.status === "MEMBER");
  const byDay = new Map<number, { visits: number; people: number; came: number }>();
  for (const v of past) {
    const key = v.visitDate.getTime();
    const row = byDay.get(key) ?? { visits: 0, people: 0, came: 0 };
    row.visits += 1;
    row.people += totalPeople(v);
    if (CAME.includes(v.status)) row.came += 1;
    byDay.set(key, row);
  }
  const lastDays = [...byDay.entries()].sort((a, b) => b[0] - a[0]).slice(0, 8);
  const bySource = new Map<string, number>();
  for (const v of all) bySource.set(sourceLabel(v.source), (bySource.get(sourceLabel(v.source)) ?? 0) + 1);
  const sources = [...bySource.entries()].sort((a, b) => b[1] - a[1]);
  const maxSource = Math.max(1, ...sources.map(([, n]) => n));

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-measure text-sm text-gn-cream/70">
          Les personnes qui annoncent leur première venue depuis la page{" "}
          <Link href="/visite" className="text-gn-gold underline underline-offset-2">Première visite</Link>.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link href="/equipe-accueil" className={button}>Feuille d&apos;accueil</Link>
          <Link href="/admin/visites/affiche" className={button}>Affiche avec QR code</Link>
        </div>
      </div>

      {/* Prochains cultes */}
      <section aria-labelledby="a-venir">
        <h2 id="a-venir" className="font-serif text-xl font-semibold text-gn-cream">À venir</h2>
        {upcoming.length === 0 ? (
          <p className="mt-3 text-gn-cream/60">Aucune visite annoncée pour les prochains cultes.</p>
        ) : (
          <div className="mt-4 space-y-8">
            {[...upcomingByDate.entries()].map(([time, visits]) => {
              const date = new Date(time);
              const service = visitServiceFor(date);
              const people = visits.reduce((n, v) => n + totalPeople(v), 0);
              const children = visits.reduce((n, v) => n + v.childrenCount, 0);
              return (
                <div key={time}>
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <h3 className="font-serif text-lg font-semibold capitalize text-gn-cream">{formatVisitDayWithYear(date)}</h3>
                      <p className="text-sm text-gn-gold">
                        {visits.length} visite{visits.length > 1 ? "s" : ""}, {people} personne{people > 1 ? "s" : ""}
                        {children > 0 ? `, dont ${children} enfant${children > 1 ? "s" : ""}` : ""}
                        {service ? ` · ${service.label}, ${service.time}` : ""}
                      </p>
                    </div>
                    <a
                      href={whatsappUrl(null, teamSummaryMessage(date, visits))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={button}
                    >
                      Envoyer la liste à l&apos;accueil (WhatsApp)
                    </a>
                  </div>
                  <div className="mt-3 space-y-3">
                    {visits.map((v) => (
                      <VisitCard key={v.id} visit={v} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Statistiques */}
      <section aria-labelledby="stats" className="rounded-2xl border border-gn-cream/15 bg-gn-black-soft p-5">
        <h2 id="stats" className="font-serif text-xl font-semibold text-gn-cream">Statistiques (12 derniers mois)</h2>
        <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Visites annoncées", value: past.length },
            { label: "Venues (cochées par l'accueil)", value: came.length },
            { label: "Devenues membres", value: members.length },
            { label: "Taux de venue", value: past.length ? `${Math.round((came.length / past.length) * 100)} %` : "–" },
          ].map((item) => (
            <div key={item.label} className="rounded-lg border border-gn-cream/15 p-3">
              <dt className="text-xs text-gn-cream/60">{item.label}</dt>
              <dd className="mt-1 font-serif text-2xl font-bold text-gn-cream">{item.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-2 text-xs text-gn-cream/60">
          Le taux de venue n&apos;a de sens que si l&apos;accueil coche les arrivées sur la feuille d&apos;accueil.
        </p>

        {lastDays.length > 0 && (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm text-gn-cream/80">
              <caption className="mb-2 text-left text-sm font-semibold text-gn-cream">Derniers jours de culte avec des visites</caption>
              <thead className="text-xs text-gn-cream/60">
                <tr>
                  <th scope="col" className="py-2 pr-4 font-medium">Jour</th>
                  <th scope="col" className="py-2 pr-4 font-medium">Visites</th>
                  <th scope="col" className="py-2 pr-4 font-medium">Personnes</th>
                  <th scope="col" className="py-2 font-medium">Venues</th>
                </tr>
              </thead>
              <tbody>
                {lastDays.map(([time, row]) => (
                  <tr key={time} className="border-t border-gn-cream/10">
                    <td className="py-2 pr-4 capitalize">{formatVisitDay(new Date(time))}</td>
                    <td className="py-2 pr-4">{row.visits}</td>
                    <td className="py-2 pr-4">{row.people}</td>
                    <td className="py-2">{row.came}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {sources.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-2 text-sm font-semibold text-gn-cream">Comment ils ont connu l&apos;église</h3>
            <ul className="space-y-2">
              {sources.map(([label, n]) => (
                <li key={label} className="flex items-center gap-3 text-sm text-gn-cream/80">
                  <span className="w-48 shrink-0">{label}</span>
                  <span className="h-2 rounded-full bg-gn-gold" style={{ width: `${(n / maxSource) * 100}%`, maxWidth: "50%", minWidth: "0.5rem" }} aria-hidden="true" />
                  <span>{n}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Visites récentes passées */}
      {recentPast.length > 0 && (
        <details className="rounded-2xl border border-gn-cream/15 p-5">
          <summary className="min-h-[44px] cursor-pointer font-serif text-lg font-semibold text-gn-cream">
            Visites passées (60 derniers jours) : {recentPast.length}
          </summary>
          <div className="mt-4 space-y-3">
            {recentPast.map((v) => (
              <VisitCard key={v.id} visit={v} />
            ))}
          </div>
        </details>
      )}

      <p className="text-xs text-gn-cream/60">
        Les noms et coordonnées sont effacés automatiquement {VISIT_RETENTION_DAYS} jours après le jour du culte ; seuls les totaux sont conservés.
      </p>
    </div>
  );
}

type VisitRow = Awaited<ReturnType<typeof prisma.visit.findMany>>[number];

function VisitCard({ visit: v }: { visit: VisitRow }) {
  const service = visitServiceFor(v.visitDate);
  return (
    <div className="rounded-2xl border border-gn-cream/15 bg-gn-black-soft p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-semibold text-gn-cream">
          {v.firstName} {v.lastName}
        </p>
        <p className="text-xs text-gn-cream/60">
          {formatVisitDay(v.visitDate)}
          {service ? ` à ${service.time}` : ""} · {VISIT_STATUS_LABELS[v.status]}
        </p>
      </div>
      <p className="mt-1 text-sm text-gn-cream/70">{peopleLabel(v)}</p>
      {v.companionNames && <p className="text-sm text-gn-cream/70">Avec : {v.companionNames}</p>}
      <p className="mt-1 text-sm text-gn-cream/60">
        {[v.phone, v.email].filter(Boolean).join(" · ") || "Aucune coordonnée donnée"}
        {" · "}
        {sourceLabel(v.source)}
      </p>
      {v.prayerRequest && (
        <p className="mt-2 whitespace-pre-wrap rounded-lg border border-gn-gold/30 bg-gn-gold/10 p-3 text-sm text-gn-cream/90">
          <span className="font-semibold text-gn-gold">Demande de prière : </span>
          {v.prayerRequest}
        </p>
      )}
      <p className="mt-2 text-xs text-gn-cream/60">Annoncé le {v.createdAt.toLocaleString("fr-FR", { timeZone: "Africa/Kinshasa" })}</p>
      <div className="mt-4">
        <VisitActions
          id={v.id}
          status={v.status}
          phone={v.phone}
          firstName={v.firstName}
          visitDate={v.visitDate.toISOString()}
          note={v.note}
        />
      </div>
    </div>
  );
}
