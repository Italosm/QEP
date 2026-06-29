import { PrismaClient } from "@prisma/client";
import { Politician } from "@/types";

// Instancia única do PrismaClient para reutilização
const prisma = new PrismaClient();

/**
 * Converte os valores de tempo em anos, meses e dias para uma string legível.
 * Exemplo: 2 anos, 3 meses, 5 dias → "2 anos, 3 meses, 5 dias"
 */
function formatTenure(anos: number, meses: number, dias: number): string {
  const parts: string[] = [];
  if (anos > 0) parts.push(`${anos} ${anos === 1 ? "ano" : "anos"}`);
  if (meses > 0) parts.push(`${meses} ${meses === 1 ? "mês" : "meses"}`);
  if (dias > 0) parts.push(`${dias} ${dias === 1 ? "dia" : "dias"}`);
  return parts.join(", ") || "0 dias";
}

/**
 * Carrega todos os parlamentares (deputados e senadores) a partir do banco SQLite
 * usando o cliente Prisma. Os dados já são retornados no formato da interface
 * `Politician` utilizada pela UI.
 */
export async function loadAllPoliticians(): Promise<Politician[]> {
  const parlamentares = await prisma.parlamentar.findMany();
  // Garantimos que todos os campos obrigatórios da interface `Politician`
  // estejam no tipo correto, substituindo possíveis nulls por valores padrão.
  return parlamentares.map((p) => {
    const legislaturas = p.historico_legislaturas
      .split(',')
      .map(num => parseInt(num.trim(), 10))
      .filter(num => !isNaN(num));

    return {
      id_unico: p.id_unico,
      id_original: p.id_original,
      nome: p.nome ?? "",
      casa: p.casa,
      cargo: p.cargo,
      url_foto: p.url_foto ?? "",
      total_legislaturas: p.total_legislaturas,
      quantidadeLegislaturas: p.total_legislaturas, // Alias for compatibility
      tempo_anos: p.tempo_anos,
      tempo_meses: p.tempo_meses,
      tempo_dias: p.tempo_dias,
      // Formata o tempo de mandato para exibição na tabela
      tenure: formatTenure(p.tempo_anos, p.tempo_meses, p.tempo_dias),
      // Garantir que ufs seja um array de strings para filtragem correta
      ufs:
        typeof p.ufs === "string"
          ? p.ufs
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : p.ufs,
      partidos: p.partidos,
      historico_legislaturas: p.historico_legislaturas,
      // Corretamente populado a partir do histórico
      legislaturas: legislaturas,
    };
  });
}

/**
 * Função utilitária para fechar a conexão Prisma quando a aplicação for
 * finalizada (por exemplo, em scripts de build ou testes).
 */
export async function disconnectPrisma() {
  await prisma.$disconnect();
}
