import type { Metadata } from "next";
import Image from "next/image";
import AdminLoginForm from "@/components/AdminLoginForm";

export const metadata: Metadata = {
  title: "Espace admin",
};

export default function AdminLoginPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12 sm:px-6">
      <div className="mb-8 flex flex-col items-center text-center">
        <Image
          src="/logo-gospel-nation.png"
          alt="Logo Gospel Nation"
          width={72}
          height={72}
          className="gn-logo-shadow h-16 w-16 object-contain"
        />
        <h1 className="mt-4 text-xl font-extrabold text-gn-ink">Espace admin</h1>
        <p className="mt-1 text-sm text-gn-ink/60">Accès réservé à l&apos;équipe de l&apos;église</p>
      </div>
      <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <AdminLoginForm />
      </div>
    </div>
  );
}
