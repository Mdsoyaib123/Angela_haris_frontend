interface AlertToggleItemProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

export default function AlertToggleItem({
  label,
  checked,
  onChange,
}: AlertToggleItemProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-700">{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`
        relative inline-flex items-center
        h-3 w-7 rounded-full
        transition-colors duration-300
        focus:outline-none focus:ring-2 focus:ring-green-500/40 cursor-pointer
        ${checked ? "bg-green-500" : "bg-gray-300"}
      `}
      >
        {/* Thumb */}
        <span
          className={`
          absolute left-0
          h-5 w-5 rounded-full
          bg-[#00A849] shadow-md
          transition-transform duration-300 ease-out
          ${checked ? "translate-x-4" : "-translate-x-2"}
        `}
        />
      </button>
    </div>
  );
}
