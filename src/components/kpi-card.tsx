
interface KPICardProps {
  label: string;
  value: string | number;
}

export function KPICard({ label, value }: KPICardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
        {label}
      </h3>
      <p className="text-4xl font-bold text-slate-900 mt-2">{value}</p>
    </div>
  );
}
