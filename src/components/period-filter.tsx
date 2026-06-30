"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function PeriodFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Pega o valor atual da URL. Se não existir, o padrão é "moderno"
  const currentPeriod = searchParams.get("periodo") || "moderno";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams);

    if (value === "moderno") {
      // Deixa a URL limpa para a visualização padrão (sem parâmetros)
      params.delete("periodo");
    } else {
      params.set("periodo", value);
    }

    // Atualiza a URL sem recarregar a página inteira (soft navigation)
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <select
      value={currentPeriod}
      onChange={handleChange}
      className="h-10 px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 shadow-sm cursor-pointer"
    >
      <option value="moderno">Nova República (Pós-1987)</option>
      <option value="historico">Histórico Completo (Desde 1826)</option>
    </select>
  );
}
