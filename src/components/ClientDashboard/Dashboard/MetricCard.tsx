interface MetricCardProps {
  label: string;
  value: number | string;
  bgColor: string;
}

export function MetricCard({ label, value, bgColor }: MetricCardProps) {
  return (
    <div className={`${bgColor} rounded-lg p-4 border border-gray-200`}>
      <p className="text-sm font-medium text-[#1D2028] mb-4">{label}</p>
      <p className="text-4xl font-medium text-[#0F1325]">{value}</p>
    </div>
  );
}

// interface MetricCardProps {
//   label: string;
//   value: string;
//   bgColor: string;
// }

// export function MetricCard({ label, value, bgColor }: MetricCardProps) {
//   return (
//     <div className={`${bgColor} rounded-lg p-4 border border-gray-200`}>
//       <p className="text-sm font-medium text-[#1D2028] mb-4">{label}</p>
//       <p className="text-4xl font-medium text-[#0F1325]">{value}</p>
//     </div>
//   );
// }
