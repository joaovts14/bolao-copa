import Link from "next/link";
export default function Home() {
  return (
    <main className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-xl rounded-2xl bg-white p-8 shadow">
        <h1 className="text-2xl font-bold">Bolão da Copa 2026</h1>
        <p className="mt-3 text-gray-700">Login simples já habilitado. Escolha para onde ir:</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/sign-in" className="rounded-xl border px-4 py-2">Login</Link>
          <Link href="/palpites" className="rounded-xl bg-black px-4 py-2 text-white">Palpites (Grupos)</Link>
          <Link href="/results" className="rounded-xl border px-4 py-2">Resultados (Admin Local)</Link>
          <Link href="/ranking" className="rounded-xl border px-4 py-2">Pontuação</Link>
        </div>
      </div>
    </main>
  );
}