"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser, clearUser } from "@/lib/clientAuth";

export default function Dashboard() {
  const router = useRouter();
  const [nickname, setNickname] = useState<string | null>(null);

  useEffect(() => {
    const u = getUser();
    if (!u) {
      router.replace("/sign-in");
      return;
    }
    setNickname(u.nickname);
  }, [router]);

  if (!nickname) {
    return (
      <main className="min-h-screen grid place-items-center p-6">
        <p className="text-sm text-gray-600">Carregando…</p>
      </main>
    );
  }

  function handleSignOut() {
    clearUser();
    router.replace("/sign-in");
  }

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-4xl">
        <header className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Meu Bolão</h2>
          <button onClick={handleSignOut} className="rounded-xl border px-4 py-2">
            Sair
          </button>
        </header>

        <p className="text-gray-700">
          Bem-vindo, <span className="font-semibold">{nickname}</span>!
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-4 shadow">
            <h3 className="mb-2 font-semibold">Minhas Ligas</h3>
            <p className="text-sm text-gray-600">Em breve: criar/entrar por convite.</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow">
            <h3 className="mb-2 font-semibold">Palpites</h3>
            <p className="text-sm text-gray-600">Em breve: partidas e placares.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
