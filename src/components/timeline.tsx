"use client";

interface TimelineProps {
  activeLegislatures: number[];
  allLegislatures: number[];
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
};

export function Timeline({
  activeLegislatures,
  allLegislatures,
}: TimelineProps) {
  const getTooltipText = (leg: number, isActive: boolean) => {
    const yearRange = anosLegislatura[leg];
    const status = isActive ? " - Ativo" : "";

    if (yearRange) {
      return `Legislatura ${leg} (${yearRange})${status}`;
    }
    // Fallback for older legislatures not in the lookup table
    return `Legislatura ${leg}${status}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-bold text-slate-900 mb-6">
        Linha do Tempo de Mandatos
      </h3>
      <div className="relative px-2">
        {/* Continuous Line */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 -z-0" />

        <div className="relative z-10 flex justify-between items-center">
          {allLegislatures.map((leg) => {
            const isActive = activeLegislatures.includes(leg);
            const circleBase =
              "flex items-center justify-center rounded-full transition-all duration-300 ease-in-out";

            const activeClasses =
              "w-10 h-10 bg-emerald-500 text-white font-bold shadow-md ring-4 ring-emerald-50";
            const inactiveClasses =
              "w-8 h-8 bg-slate-100 text-slate-400 text-xs font-medium border-2 border-slate-200";

            return (
              <div
                key={leg}
                className={`${circleBase} ${
                  isActive ? activeClasses : inactiveClasses
                }`}
                title={getTooltipText(leg, isActive)}
              >
                {leg}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
