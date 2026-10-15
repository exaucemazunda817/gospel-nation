import { prisma } from "@/lib/prisma";
import DonationMethodEditor from "@/components/admin/DonationMethodEditor";

export default async function AdminDonationsPage() {
  const methods = await prisma.donationMethod.findMany({ orderBy: { order: "asc" } });
  return (
    <div className="space-y-8">
      <p className="text-sm text-gn-cream/70">
        Ces coordonnées s&apos;affichent sur la page Dons. Un moyen n&apos;apparaît que s&apos;il est coché « Afficher » et qu&apos;il ne contient plus de texte « À COMPLÉTER ».
      </p>
      <div className="space-y-4">
        {methods.map((m) => (
          <DonationMethodEditor
            key={m.id}
            method={{ id: m.id, label: m.label, accountName: m.accountName, accountValue: m.accountValue, instructions: m.instructions ?? "", isActive: m.isActive }}
          />
        ))}
      </div>
      <DonationMethodEditor />
    </div>
  );
}
