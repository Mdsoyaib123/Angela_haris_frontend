import { Command, Search } from "lucide-react";
import { useState } from "react";
import GenerateAccessModal from "./GenerateAccessModal";
interface SearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchHeader({ value, onChange }: SearchProps) {
  const [isGeneralAccessOpen, setIsGeneralAccessOpen] = useState(false);
  const handleGeneralAccess = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsGeneralAccessOpen(true);
  };
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 xl:gap-0 w-full mb-12">
        {/* Left Side: Search Bar */}
        <div className="relative flex items-center w-full">
          <div
            className="flex items-center w-full px-4 py-3 bg-white border border-slate-100 rounded-lg shadow-sm
        focus-within:ring-2 focus-within:ring-green-500/20
        focus-within:border-green-500/50
        transition-all duration-200"
          >
            <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />

            <input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              type="text"
              placeholder="Search anything here..."
              className="w-full text-sm font-medium text-slate-600 placeholder:text-slate-400 bg-transparent focus:outline-none"
            />

            {/* Hide shortcut on small screens */}
            <div className="hidden sm:flex items-center gap-1.5 ml-2 px-2 py-1 bg-slate-50 border border-slate-200 rounded-sm">
              <Command className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[11px] font-bold text-slate-400">K</span>
            </div>
          </div>
        </div>

        {/* Right Side: Filter Switcher */}
        <div className="flex w-full justify-end">
          <button
            onClick={(e) => handleGeneralAccess(e)}
            className="w-full lg:max-w-fit text-base font-medium text-white py-2 px-7 rounded-full bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 active:translate-y-0 active:shadow-md focus:outline-none cursor-pointer"
          >
            Create Account
          </button>
        </div>
      </div>
      <GenerateAccessModal
        isOpen={isGeneralAccessOpen}
        onClose={() => setIsGeneralAccessOpen(false)}
      />
    </>
  );
}
