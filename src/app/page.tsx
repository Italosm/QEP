import { loadAllPoliticians } from "@/lib/load-data";
import { KPICard } from "@/components/kpi-card";
import { PoliticiansTable } from "./politicians-table";

export default async function Home() {
  const politicians = await loadAllPoliticians();

  const totalDeputados = politicians.filter((p) => p.casa === "Câmara").length;
  const totalSenadores = politicians.filter((p) => p.casa === "Senado").length;
  const maiorNumeroLegislaturas = Math.max(
    ...politicians.map((p) => p.total_legislaturas ?? 0),
  );
  const totalLegislaturas = new Set(
    politicians.flatMap((p) => p.legislaturas ?? []),
  ).size;

  return (
    <main className="bg-slate-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Quem Está no Poder?
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Análise histórica do Congresso Nacional utilizando dados públicos.
        </p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 my-8">
          <KPICard label="Deputados" value={totalDeputados} />
          <KPICard label="Senadores" value={totalSenadores} />
          <KPICard
            label="Maior Nº de Legislaturas"
            value={maiorNumeroLegislaturas}
          />
          <KPICard label="Legislaturas Analisadas" value={totalLegislaturas} />
        </div>

        <PoliticiansTable politicians={politicians} />
      </div>
    </main>
  );
}
