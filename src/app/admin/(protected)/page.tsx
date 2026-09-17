import { prisma } from "@/lib/prisma";
import ModerateTestimonyActions from "@/components/admin/ModerateTestimonyActions";

export default async function AdminTestimoniesPage() {
  const testimonies = await prisma.testimony.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });

  if (testimonies.length === 0) {
    return <p className="text-gn-cream/60">Aucun témoignage soumis pour le moment.</p>;
  }

  return (
    <div className="space-y-4">
      {testimonies.map((t) => (
        <div
          key={t.id}
          className="rounded-2xl border border-gn-cream/15 bg-gn-black-soft p-5"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-semibold text-gn-cream">{t.authorName}</p>
            <p className="text-xs text-gn-cream/50">
              {t.createdAt.toLocaleString("fr-FR")}
            </p>
          </div>
          <p className="mt-2 whitespace-pre-wrap text-sm text-gn-cream/80">{t.content}</p>
          {t.videoUrl && (
            <a
              href={t.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm text-gn-gold hover:underline"
            >
              Voir la vidéo
            </a>
          )}
          <div className="mt-4">
            <ModerateTestimonyActions id={t.id} status={t.status} />
          </div>
        </div>
      ))}
    </div>
  );
}
