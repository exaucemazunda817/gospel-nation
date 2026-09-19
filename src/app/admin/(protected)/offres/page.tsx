import { prisma } from "@/lib/prisma";
import ModerateOfferActions from "@/components/admin/ModerateOfferActions";

export default async function AdminOffersPage() {
  const offers = await prisma.memberOffer.findMany({
    include: { user: { select: { firstName: true, lastName: true } } },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });

  if (offers.length === 0) {
    return <p className="text-gn-cream/60">Aucune offre pour le moment.</p>;
  }

  return (
    <div className="space-y-4">
      {offers.map((o) => {
        const author = o.user ? `${o.user.firstName} ${o.user.lastName}` : (o.authorName ?? "Auteur inconnu");
        return (
          <div key={o.id} className="rounded-2xl border border-gn-cream/15 bg-gn-black-soft p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-semibold text-gn-cream">{o.title}</p>
              <p className="text-xs text-gn-cream/50">{o.createdAt.toLocaleString("fr-FR")}</p>
            </div>
            <p className="mt-1 text-sm text-gn-cream/60">
              {author}
              {o.category ? ` · ${o.category}` : ""}
              {o.clerkUserId ? " · compte en ligne" : " · saisie par l'admin"}
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm text-gn-cream/80">{o.description}</p>
            <p className="mt-2 text-xs text-gn-cream/60">
              {[o.contactPhone, o.contactEmail, o.externalUrl].filter(Boolean).join(" · ") || "Aucun contact indiqué"}
            </p>
            <div className="mt-4">
              <ModerateOfferActions id={o.id} status={o.status} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
