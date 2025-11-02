"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { setUser } from "@/lib/clientAuth";

export default function SignInPage() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nick = nickname.trim();
    if (!nick) return;
    setLoading(true);
    setUser({ nickname: nick });
    router.replace("/dashboard");
  }

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl bg-white p-6 shadow">
        <h1 className="mb-4 text-xl font-semibold">Entrar no Bolão</h1>
        <label className="block mb-2">Apelido</label>
        <input
          className="mb-4 w-full rounded border p-2"
          placeholder="Ex.: João"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
        />
        <button disabled={loading} className="w-full rounded-xl bg-black px-4 py-2 text-white">
          {loading ? "Entrando..." : "Entrar"}
        </button>
        <p className="mt-3 text-xs text-gray-500">
          Protótipo sem autenticação real — apenas salva seu apelido no navegador.
        </p>
      </form>
    </main>
  );
}
