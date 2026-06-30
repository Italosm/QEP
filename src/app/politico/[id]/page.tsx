import {
  getPoliticianById,
  getAllPoliticians,
} from "@/lib/brazil-congress-api";
import { notFound } from "next/navigation";
import { KPICard } from "@/components/kpi-card";
import { Timeline } from "@/components/timeline";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PoliticianImage } from "@/components/politician-image";

type PageProps = {
  params: {
    id: string;
  };
};

export async function generateStaticParams() {
  const politicians = await getAllPoliticians();
  // Filter out any entries without a valid unique ID to avoid undefined params
  return politicians
    .filter((p) => p.id_unico) // ensure the field exists
    .map((p) => ({
      id: p.id_unico,
    }));
}

export default async function PoliticianPage({
  params: awaitedParams,
}: PageProps) {
  const { id } = await awaitedParams;
  const politician = await getPoliticianById(id);

  if (!politician) {
    notFound();
  }

  const {
    nome,
    casa,
    url_foto,
    quantidadeLegislaturas,
    ufs,
    legislaturas,
    partidos,
  } = politician;
  // Ensure legislaturas is an array for timeline calculations
  const legislaturasArray = legislaturas ?? [];
  // Derive first and last legislatura from the array, if available
  // Use first and last entries of legislaturas array, fallback to defaults
  const primeiraLegislatura: number = legislaturasArray.length
    ? legislaturasArray[0]
    : 1;
  const ultimaLegislatura: number = legislaturasArray.length
    ? legislaturasArray[legislaturasArray.length - 1]
    : 58;

  // Determine a relevant range for the timeline
  const firstActive = primeiraLegislatura ?? 1;
  const lastActive = ultimaLegislatura ?? 58;
  const rangePadding = 5;
  const startRange = Math.max(1, firstActive - rangePadding);
  const endRange = Math.min(58, lastActive + rangePadding);

  const allLegislaturesInRange = Array.from(
    { length: endRange - startRange + 1 },
    (_, i) => startRange + i,
  );

  const isSenado = casa === "Senado";
  const badgeClass = isSenado
    ? "bg-sky-100 text-sky-800"
    : "bg-emerald-100 text-emerald-800";

  const timelineActiveBubbleClass = isSenado
    ? "bg-sky-100 text-sky-800"
    : "bg-emerald-100 text-emerald-800";

  const timelineLineClass = isSenado ? "bg-sky-200" : "bg-emerald-200";

  return (
    <main className="bg-slate-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para o dashboard
        </Link>

        <header className="flex flex-col sm:flex-row items-center gap-6 mb-8">
          <PoliticianImage
            src={url_foto}
            alt={`Foto de ${nome}`}
            width={96}
            height={96}
            className="rounded-full border-4 border-white shadow-md shrink-0"
          />
          <div className="text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              {nome}
            </h1>
            <div className="mt-2 flex justify-center sm:justify-start">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${badgeClass}`}
              >
                {isSenado ? "Senado" : "Câmara"}
              </span>
            </div>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 my-8">
          <KPICard
            label="Qtd. Legislaturas"
            value={quantidadeLegislaturas ?? 0}
          />
          <KPICard
            label="UFs"
            value={Array.isArray(ufs) ? ufs.join(", ") : ufs}
          />
          <KPICard
            label="Partidos"
            value={
              Array.isArray(partidos)
                ? partidos.join(", ")
                : partidos
                  ? partidos
                  : ""
            }
          />
        </div>

        <Timeline
          activeLegislatures={legislaturasArray}
          allLegislatures={allLegislaturesInRange}
          activeClassName={timelineActiveBubbleClass}
          lineClassName={timelineLineClass}
        />
      </div>
    </main>
  );
}
