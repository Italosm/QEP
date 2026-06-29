import { Politician, Legislatures, Legislature } from "@/types";

function formatTenure(days: number) {
  const years = Math.floor(days / 365);
  const months = Math.floor((days % 365) / 30);
  const remainingDays = Math.floor(days % 30);

  return `${years} anos, ${months} mêses e ${remainingDays} dias`;
}

function calculateTenureInDays(
  politicianLegislatures: number[],
  allLegislatures: Legislatures,
  house: "Deputados" | "Senado",
): number {
  const uniqueLegislatures = [...new Set(politicianLegislatures)];
  if (house === "Deputados") {
    const yearsInPower = uniqueLegislatures.length * 4;
    return yearsInPower * 365;
  }

  let totalDays = 0;
  const houseLegislatures =
    house === "Senado" ? allLegislatures.senado : allLegislatures.camara;

  for (const legNumber of uniqueLegislatures) {
    const legislatureData = houseLegislatures.find(
      (l: Legislature) =>
        (l.idLegislatura || parseInt(l.NumeroLegislatura || l.id || "0")) ===
        legNumber,
    );

    if (legislatureData) {
      const startDate = new Date(
        legislatureData.DataInicio || legislatureData.dataInicio || "",
      );
      const endDate = new Date(
        legislatureData.DataFim || legislatureData.dataFim || "",
      );
      if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        totalDays += diffDays;
      }
    }
  }

  return totalDays;
}

export function calculateStatistics(
  politicians: Omit<
    Politician,
    | "quantidadeLegislaturas"
    | "primeiraLegislatura"
    | "ultimaLegislatura"
    | "tenure"
    | "tenureString"
  >[],
  legislaturesData: Legislatures,
): Politician[] {
  return politicians.map((p) => {
    const legislaturas = [...new Set(p.legislaturas)].sort((a, b) => a - b);
    const tenureInDays = calculateTenureInDays(
      legislaturas,
      legislaturesData,
      p.casa,
    );

    return {
      ...p,
      legislaturas,
      quantidadeLegislaturas: legislaturas.length,
      primeiraLegislatura: legislaturas[0] || 0,
      ultimaLegislatura: legislaturas[legislaturas.length - 1] || 0,
      ufs: [...new Set(p.ufs)].sort(),
      tenure: tenureInDays,
      tenureString: formatTenure(tenureInDays),
    };
  });
}
