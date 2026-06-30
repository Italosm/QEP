import { Sparkline } from "./sparkline";

interface KPICardProps {
  label: string;
  value: string | number;
  data?: number[];
}

export function KPICard({ label, value, data }: KPICardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
        {label}
      </h3>
      <div className="mt-2 grow flex items-end justify-between">
        <p className="text-3xl font-bold text-slate-900">{value}</p>
        {data && (
          <div className="ml-4">
            <Sparkline
              data={data}
              width={80}
              height={20}
              strokeColor="#94a3b8"
            />
          </div>
        )}
      </div>
    </div>
  );
}
