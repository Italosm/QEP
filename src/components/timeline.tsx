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
  38: "1947-1951",
  37: "1943-1947",
  36: "1939-1943",
  35: "1935-1939",
  34: "1931-1935",
  33: "1927-1931",
  32: "1923-1927",
  31: "1919-1923",
  30: "1915-1919",
  29: "1911-1915",
  28: "1907-1911",
  27: "1903-1907",
  26: "1899-1903",
  25: "1895-1899",
  24: "1891-1895",
  23: "1887-1891",
  22: "1883-1887",
  21: "1879-1883",
  20: "1875-1879",
  19: "1871-1875",
  18: "1867-1871",
  17: "1863-1867",
  16: "1859-1863",
  15: "1855-1859",
  14: "1851-1855",
  13: "1847-1851",
  12: "1843-1847",
  11: "1839-1843",
  10: "1835-1839",
  9: "1831-1835",
  8: "1827-1831",
  7: "1823-1827",
  6: "1819-1823",
  5: "1815-1819",
  4: "1811-1815",
  3: "1807-1811",
  2: "1803-1807",
  1: "1799-1803",
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
