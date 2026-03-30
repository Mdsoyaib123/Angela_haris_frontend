import { useState } from "react";

interface TooltipProps {
  children: React.ReactNode;
  label: string;
  duration?: number; // milliseconds
  className?: string;
}

export default function Tooltip({
  children,
  label,
  duration = 1500,
  className = "",
}: TooltipProps) {
  const [visible, setVisible] = useState(false);

  const showTooltip = () => {
    setVisible(true);
    setTimeout(() => setVisible(false), duration);
  };

  return (
    <div className="relative inline-block" onClick={showTooltip}>
      {children}
      {visible && (
        <span
          className={`absolute left-full top-1/2 -translate-y-1/2 ml-3
            whitespace-nowrap rounded-md bg-gray-100 text-green-600
            text-xs px-3 py-1.5 font-semibold shadow-md
            transition-opacity duration-200 ease-out
            ${className}`}
        >
          {label}
        </span>
      )}
    </div>
  );
}
