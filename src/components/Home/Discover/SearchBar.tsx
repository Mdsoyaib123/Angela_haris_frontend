import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div
      className="
        w-full
        max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl
        mb-4
      "
    >
      <div className="relative">
        {/* Search Icon */}
        <Search
          className="
            absolute
            left-3
            top-1/2
            -translate-y-1/2
            w-4 h-4
            text-gray-400
            pointer-events-none
          "
        />

        {/* Input */}
        <input
          type="text"
          placeholder="Search..."
          className="
            w-full
            bg-gray-100
            hover:bg-gray-200
            focus:bg-white
            rounded-lg
            py-3 sm:py-3.5
            pl-10 pr-4
            text-sm
            outline-none
            border border-transparent
            focus:border-gray-300
            focus:ring-2 focus:ring-gray-200
            transition-all duration-200
          "
        />
      </div>
    </div>
  );
}
