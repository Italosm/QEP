import { loadAllPoliticians, loadDemocracyPoliticians } from "@/lib/load-data";
import { KPICard } from "@/components/kpi-card";
import { PoliticiansTable } from "./politicians-table";
import { PeriodFilter } from "@/components/period-filter";

// 1. FORÇA O NEXT.JS A LER A URL EM TEMPO REAL (MATA O CACHE ESTÁTICO)
export const dynamic = "force-dynamic";

// 2. ATUALIZA A TIPAGEM PARA O PADRÃO DO NEXT 15 (PROMISE)
interface HomeProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home(props: HomeProps) {
  // 3. USA O AWAIT PARA LER A URL CORRETAMENTE
  const params = await props.searchParams;
  const periodo = params?.periodo || "moderno";

  // Carrega os dados com base na escolha do período
  const politicians =
    periodo === "historico"
      ? await loadAllPoliticians()
      : await loadDemocracyPoliticians();

  const totalDeputados = politicians.filter((p) => p.casa === "Câmara").length;
  const totalSenadores = politicians.filter((p) => p.casa === "Senado").length;

  const maiorNumeroLegislaturas =
    politicians.length > 0
      ? Math.max(...politicians.map((p) => p.total_legislaturas ?? 0))
      : 0;

  const legislaturas = [
    ...new Set(politicians.flatMap((p) => p.legislaturas ?? [])),
  ].sort((a, b) => a - b);

  const totalLegislaturas = legislaturas.length;

  const deputadosPorLegislatura = legislaturas.map(
    (leg) =>
      politicians.filter(
        (p) => p.casa === "Câmara" && p.legislaturas?.includes(leg),
      ).length,
  );

  const senadoresPorLegislatura = legislaturas.map(
    (leg) =>
      politicians.filter(
        (p) => p.casa === "Senado" && p.legislaturas?.includes(leg),
      ).length,
  );

  return (
    <main className="bg-slate-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Quem Está no Poder?
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {periodo === "historico"
                ? "Análise histórica completa do Congresso Nacional desde 1826."
                : "Análise do Congresso Nacional na Nova República (Pós-1987)."}
            </p>
          </div>

          <div className="shrink-0">
            <PeriodFilter />
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 my-8">
          <KPICard
            label="Deputados"
            value={totalDeputados}
            data={deputadosPorLegislatura}
          />
          <KPICard
            label="Senadores"
            value={totalSenadores}
            data={senadoresPorLegislatura}
          />
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
