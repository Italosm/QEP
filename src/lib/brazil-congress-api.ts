import { PrismaClient } from "@prisma/client";
import { Politician } from "@/types";

/** Prisma client singleton for Next.js */
// Prisma client singleton for Next.js
// Added non-empty options to satisfy PrismaClient initialization requirements.
// Includes log configuration and explicit datasource URL for SQLite database.
const prismaClientSingleton = () => {
  // Provide minimal non-empty options; the datasource URL can be set via DATABASE_URL env var.
  return new PrismaClient({
    log: ["error", "warn"],
  });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;

// Existing helper functions can continue to use the default export above.
export async function getAllPoliticians(): Promise<Politician[]> {
  const records = await prisma.parlamentar.findMany();
  return records.map((r) => {
    return {
      id_unico: r.id_unico,
      id_original: r.id_original,
      nome: r.nome,
      casa: r.casa,
      cargo: r.cargo,
      url_foto: r.url_foto,
      total_legislaturas: r.total_legislaturas,
      tempo_anos: r.tempo_anos,
      tempo_meses: r.tempo_meses,
      tempo_dias: r.tempo_dias,
      // Human‑readable string for "tempo de poder"
      tenureString: `${r.tempo_anos} anos ${r.tempo_meses} meses ${r.tempo_dias} dias`,
      // Convert comma‑separated strings to arrays, handling null/empty safely
      ufs: r.ufs
        ? r.ufs
            .split(",")
            .map((uf) => uf.trim())
            .filter(Boolean)
        : [],
      partidos: r.partidos
        ? r.partidos
            .split(",")
            .map((p) => p.trim())
            .filter(Boolean)
        : [],
      historico_legislaturas: r.historico_legislaturas ?? "",
      legislaturas: r.historico_legislaturas
        ? r.historico_legislaturas
            .split(",")
            .map((s) => Number(s.trim()))
            .filter(Boolean)
        : [],
      quantidadeLegislaturas: r.total_legislaturas,
    } as unknown as Politician;
  });
}
export async function getPoliticianById(
  id: string,
): Promise<Politician | null> {
  const record = await prisma.parlamentar.findUnique({
    where: { id_unico: id },
  });
  if (!record) return null;
  const legislaturas = record.historico_legislaturas
    ? record.historico_legislaturas
        .split(",")
        .map((s) => Number(s.trim()))
        .filter(Boolean)
    : [];
  const primeira = legislaturas.length ? legislaturas[0] : undefined;
  const ultima = legislaturas.length
    ? legislaturas[legislaturas.length - 1]
    : undefined;
  return {
    id_unico: record.id_unico,
    id_original: record.id_original,
    nome: record.nome,
    casa: record.casa,
    cargo: record.cargo,
    url_foto: record.url_foto,
    total_legislaturas: record.total_legislaturas,
    tempo_anos: record.tempo_anos,
    tempo_meses: record.tempo_meses,
    tempo_dias: record.tempo_dias,
    ufs: record.ufs
      ? record.ufs
          .split(",")
          .map((uf) => uf.trim())
          .filter(Boolean)
      : [],
    partidos: record.partidos
      ? record.partidos
          .split(",")
          .map((p) => p.trim())
          .filter(Boolean)
      : [],
    historico_legislaturas: record.historico_legislaturas ?? "",
    legislaturas,
    quantidadeLegislaturas: record.total_legislaturas,
    tenureString: primeira && ultima ? `${primeira} - ${ultima}` : undefined,
  } as unknown as Politician;
}
