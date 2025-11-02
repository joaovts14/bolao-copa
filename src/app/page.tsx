import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-xl rounded-2xl bg-white p-8 shadow">
        <h1 className="text-2xl font-bold">Bolão da Copa</h1>
        <p className="mt-4">Protótipo com login simples (sem autenticação real).</p>
        <div className="mt-6">
          <Link href="/sign-in" className="rounded-xl bg-black px-4 py-2 text-white">
            Entrar
          </Link>
        </div>
      </div>
    </main>
  );
}
