// src/components/admin/users/SearchHeader.tsx

import { TbUserPlus } from "react-icons/tb";
import AddUsersModal from "./AddUsersModal";
import { Search, Command } from "lucide-react";
import { useState } from "react";

interface SearchHeaderProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  onSearch: (searchTerm: string) => void;
}

export default function SearchHeader({
  activeFilter,
  onFilterChange,
  onSearch,
}: SearchHeaderProps) {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const filters = ["All", "Athletes", "Users"];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    onSearch(value);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-12 xl:grid-cols-3 gap-4 w-full mb-12 items-center">
        {/* Left: Search */}
        <div className="relative flex items-center w-full md:col-span-12 xl:col-span-1">
          <div
            className="flex items-center w-full px-4 py-3 bg-white border border-slate-100 rounded-lg shadow-sm
        focus-within:ring-2 focus-within:ring-green-500/20
        focus-within:border-green-500/50
        transition-all duration-200"
          >
            <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />

            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchInput}
              onChange={handleSearchChange}
              className="w-full text-sm font-medium text-slate-600 placeholder:text-slate-400 bg-transparent focus:outline-none"
            />

            {/* Shortcut */}
            <div className="hidden sm:flex items-center gap-1.5 ml-2 px-2 py-1 bg-slate-50 border border-slate-200 rounded-sm">
              <Command className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[11px] font-bold text-slate-400">K</span>
            </div>
          </div>
        </div>

        {/* Middle: Filters */}
        <div className="flex w-full md:col-span-8 xl:col-span-1 justify-start xl:justify-center">
          <div className="flex cursor-pointer flex-wrap md:flex-nowrap gap-2 items-center bg-emerald-50/50 border border-emerald-100/50 rounded-sm w-full xl:w-auto p-1">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => onFilterChange(filter)}
                className={`flex-1 cursor-pointer md:flex-none px-5 sm:px-7 lg:px-10 py-2.5 text-sm font-semibold whitespace-nowrap
            transition-all duration-300 ease-out rounded-sm
            ${
              activeFilter === filter
                ? "bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] text-white shadow-lg shadow-green-500/30 brightness-110"
                : "text-slate-500 hover:text-slate-700"
            }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Create Button */}
        <div className="flex w-full md:col-span-4 xl:col-span-1 justify-start md:justify-end">
          <button
            onClick={() => setIsAddUserOpen(true)}
            className="w-full sm:w-auto text-base font-medium text-white py-3 px-6 sm:px-7 rounded-full bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 active:translate-y-0 active:shadow-md focus:outline-none cursor-pointer flex justify-center items-center gap-2"
          >
            <TbUserPlus className="h-6 w-6" /> Add User
          </button>
        </div>
      </div>

      <AddUsersModal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
      />
    </>
  );
}

// import { TbUserPlus } from "react-icons/tb";
// import AddUsersModal from "./AddUsersModal";
// import { Search, Command } from "lucide-react";
// import { useState } from "react";

// export default function SearchHeader() {
//   const [activeFilter, setActiveFilter] = useState("Users");
//   const [isAddUserOpen, setIsAddUserOpen] = useState(false);
//   const filters = ["All", "Athletes", "Users"];

//   return (
//     <>
//       <div className="grid grid-cols-1 md:grid-cols-12 xl:grid-cols-3 gap-4 w-full mb-12 items-center">
//         {/* Left: Search */}
//         <div className="relative flex items-center w-full md:col-span-12 xl:col-span-1">
//           <div
//             className="flex items-center w-full px-4 py-3 bg-white border border-slate-100 rounded-lg shadow-sm
//         focus-within:ring-2 focus-within:ring-green-500/20
//         focus-within:border-green-500/50
//         transition-all duration-200"
//           >
//             <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />

//             <input
//               type="text"
//               placeholder="Search anything here..."
//               className="w-full text-sm font-medium text-slate-600 placeholder:text-slate-400 bg-transparent focus:outline-none"
//             />

//             {/* Shortcut */}
//             <div className="hidden sm:flex items-center gap-1.5 ml-2 px-2 py-1 bg-slate-50 border border-slate-200 rounded-sm">
//               <Command className="w-3.5 h-3.5 text-slate-400" />
//               <span className="text-[11px] font-bold text-slate-400">K</span>
//             </div>
//           </div>
//         </div>

//         {/* Middle: Filters */}
//         <div className="flex w-full md:col-span-8 xl:col-span-1 justify-start xl:justify-center">
//           <div className="flex flex-wrap md:flex-nowrap gap-2 items-center bg-emerald-50/50 border border-emerald-100/50 rounded-sm w-full xl:w-auto p-1">
//             {filters.map((filter) => (
//               <button
//                 key={filter}
//                 onClick={() => setActiveFilter(filter)}
//                 className={`flex-1 md:flex-none px-5 sm:px-7 lg:px-10 py-2.5 text-sm font-semibold whitespace-nowrap
//             transition-all duration-300 ease-out rounded-sm
//             ${
//               activeFilter === filter
//                 ? "bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] text-white shadow-lg shadow-green-500/30 brightness-110"
//                 : "text-slate-500 hover:text-slate-700"
//             }`}
//               >
//                 {filter}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Right: Create Button */}
//         <div className="flex w-full md:col-span-4 xl:col-span-1 justify-start md:justify-end">
//           <button
//             onClick={() => setIsAddUserOpen(true)}
//             className="w-full sm:w-auto text-base font-medium text-white py-3 px-6 sm:px-7 rounded-full bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 active:translate-y-0 active:shadow-md focus:outline-none cursor-pointer flex justify-center items-center gap-2"
//           >
//             <TbUserPlus className="h-6 w-6" /> Add User
//           </button>
//         </div>
//       </div>
//       <AddUsersModal
//         isOpen={isAddUserOpen}
//         onClose={() => setIsAddUserOpen(false)}
//       />
//     </>
//   );
// }
