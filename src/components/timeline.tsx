"use client";

interface TimelineProps {
  activeLegislatures: number[];
  allLegislatures: number[];
  activeClassName?: string;
  lineClassName?: string;
}

// Using a lookup table for historically accurate legislature years.
const anosLegislatura: { [key: number]: string } = {
  58: "2027-2031",
  57: "2023-2027",
  56: "2019-2023",
  55: "2015-2019",
  54: "2011-2015",
  53: "2007-2011",
  52: "2003-2007",
  51: "1999-2003",
  50: "1995-1999",
  49: "1991-1995",
  48: "1987-1991",
  47: "1983-1987",
  46: "1979-1983",
  45: "1975-1979",
  44: "1971-1975",
  43: "1967-1971",
  42: "1963-1967",
  41: "1959-1963",
  40: "1955-1959",
  39: "1951-1955",
  38: "1946-1951", // Inclui a Constituinte de 1946
  // --- Fim da Progressão Matemática de 4 anos ---
  37: "1934-1937", // Interrompida pelo Estado Novo
  36: "1933-1934", // Assembleia Constituinte
  35: "1930-1930", // Dissolvida pela Revolução de 1930
  34: "1927-1929", // Mandatos de 3 anos (República Velha)
  33: "1924-1926",
  32: "1921-1923",
  31: "1918-1920",
  30: "1915-1917",
  29: "1912-1914",
  28: "1909-1911",
  27: "1906-1908",
  26: "1903-1905",
  25: "1900-1902",
  24: "1897-1899",
  23: "1894-1896",
  22: "1891-1893", // Primeiro Congresso Nacional (República)
  21: "1890-1891", // Constituinte da República
  // --- Fim da República, Início do Império ---
  20: "1886-1889",
  19: "1885-1885",
  18: "1882-1884",
  17: "1878-1881",
  16: "1877-1877",
  15: "1872-1875",
  14: "1869-1872",
  13: "1867-1868",
  12: "1864-1866",
  11: "1861-1863",
  10: "1857-1860",
  9: "1853-1856",
  8: "1850-1852",
  7: "1848-1848",
  6: "1845-1847",
  5: "1843-1844",
  4: "1838-1841",
  3: "1834-1837",
  2: "1830-1833",
  1: "1826-1829", // 1ª Assembleia Geral Legislativa do Império
};

export function Timeline({
  activeLegislatures,
  allLegislatures,
  activeClassName,
  lineClassName,
}: TimelineProps) {
  const getTooltipText = (leg: number) => {
    const yearRange = anosLegislatura[leg];

    if (yearRange) {
      return `Legislatura ${leg} (${yearRange})`;
    }
    return `Legislatura ${leg}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-bold text-slate-900 mb-6">
        Linha do Tempo de Mandatos
      </h3>
      <div className="relative px-2 pt-5">
        {/* Linha contínua cinza de fundo (z-0 para ficar atrás de tudo) */}
        <div className="absolute top-10 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 z-0" />

        <div className="relative z-10 flex justify-between items-start">
          {allLegislatures.map((leg, index) => {
            const isActive = activeLegislatures.includes(leg);
            const isPrevActive =
              index > 0 &&
              activeLegislatures.includes(allLegislatures[index - 1]);

            const defaultActiveClasses =
              "w-10 h-10 bg-emerald-500 font-bold shadow-md ring-4 ring-emerald-50 text-white";
            const activeClasses = activeClassName
              ? `${activeClassName} w-10 h-10 font-bold shadow-md`
              : defaultActiveClasses;
            const inactiveClasses =
              "w-8 h-8 bg-slate-100 text-slate-400 text-xs font-medium border-2 border-slate-200";
            const year = anosLegislatura[leg];

            return (
              <div
                key={leg}
                className="flex flex-col items-center gap-y-2 flex-1 relative"
                title={getTooltipText(leg)}
              >
                {/* 
                  Linha verde de conexão atualizada: 
                  Removido o cálculo inline complexo. Adicionado 'w-full' e 'z-10'
                */}
                {isActive && isPrevActive && (
                  <div
                    className={`absolute top-5 right-1/2 w-full h-1 z-10 ${
                      lineClassName ?? "bg-emerald-500"
                    }`}
                  />
                )}

                {/* 
                  Bolha da legislatura atualizada:
                  Adicionado 'z-20' ao relative para forçar as bolhas a ficarem SEMPRE em cima da linha de conexão
                */}
                <div
                  className={`relative z-20 flex items-center justify-center rounded-full transition-all duration-300 ease-in-out ${
                    isActive ? activeClasses : inactiveClasses
                  }`}
                >
                  {leg}
                </div>

                {year && (
                  <div className="text-xs text-slate-500 font-medium absolute top-full mt-2 whitespace-nowrap">
                    {year.split("-")[0]}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
