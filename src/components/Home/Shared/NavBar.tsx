import { BiConversation, BiHomeSmile } from "react-icons/bi";
// import { BsSearch } from "react-icons/bs";
import { LuUpload } from "react-icons/lu";
import { TbBellRinging2 } from "react-icons/tb";
import { FaRegUserCircle } from "react-icons/fa";
import { HiOutlineLogout } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { CreatePostModal } from "../Home/CreatePostModal";
import { FiMenu } from "react-icons/fi";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import logoText from "@/assets/angelaharris/logo-text.svg";
import logoIcon from "@/assets/angelaharris/logo-icon.svg";

export default function NavBar() {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleFilesSelected = (files: File[]) => {
    console.log("Files selected:", files);
  };

  const navItems = [
    { id: "home", label: "Home", icon: BiHomeSmile, path: "/" },
    // { id: "discover", label: "Discover", icon: BsSearch, path: "/discover" },
    { id: "message", label: "Message", icon: BiConversation, path: "/message" },
    { id: "upload", label: "Upload", icon: LuUpload, path: "/upload" },
    {
      id: "notifications",
      label: "Notifications",
      icon: TbBellRinging2,
      path: "/notifications",
    },
    {
      id: "profile",
      label: "Profile",
      icon: FaRegUserCircle,
      path: "/profile",
    },
  ];

  return (
    <>
      <>
        {/* Mobile Overlay */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
        <button
          onClick={() => (setIsMobileOpen(true), setIsCollapsed(false))}
          className={`lg:hidden ${isMobileOpen && "hidden"} fixed top-4 left-4 z-60 p-2 bg-neutral-200 text-gray-600 rounded-lg shadow`}
        >
          <FiMenu className="w-6 h-6" />
        </button>
        <aside
          className={`
      fixed lg:sticky top-0 left-0 z-50
      h-screen lg:h-screen
      bg-white border-r border-gray-200
      py-8
      
      transition-all duration-300 ease-in-out
      
      ${isCollapsed ? "w-20 px-3" : "w-64 px-6"}
      ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
      lg:translate-x-0
    `}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-14">
            {/* Logo */}
            {/* <div className="flex items-center justify-center w-full">
              {isCollapsed ? (
                <img src={logoIcon} alt="" />
              ) : (
                <div className="flex gap-2">
                  <img src={logoIcon} alt="" />
                  <img src={logoText} alt="" />
                </div>
              )}
            </div> */}

            {/* Logo */}
            <div className="flex items-center justify-start w-full">
              {isCollapsed ? (
                <img src={logoIcon} alt="Logo Icon" />
              ) : (
                <>
                  {/* Desktop (lg+) → icon top, text bottom */}
                  <div className="hidden lg:flex flex-col items-center gap-2">
                    <img src={logoIcon} alt="Logo Icon" />
                    <img src={logoText} alt="Logo Text" />
                  </div>

                  {/* Mobile & Tablet → icon + text inline */}
                  <div className="lg:hidden flex flex-col items-center gap-2">
                    <img src={logoIcon} alt="Logo Icon" />
                    <img src={logoText} alt="Logo Text" />
                  </div>
                </>
              )}
            </div>

            {/* Desktop Collapse Button */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`
    hidden lg:flex items-center justify-center
    ml-2 text-gray-500 hover:text-green-600 cursor-pointer
    
    ${
      isCollapsed
        ? "animate-[sidebarFloatRight_2.5s_ease-in-out_infinite]"
        : "animate-[sidebarFloatLeft_2.5s_ease-in-out_infinite]"
    }
    
    hover:animate-none
  `}
            >
              {isCollapsed ? (
                <MdKeyboardDoubleArrowRight className="h-6 w-6" />
              ) : (
                <MdKeyboardDoubleArrowLeft className="h-6 w-6" />
              )}
            </button>

            {/* Mobile Close */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden ml-2"
            >
              ✕
            </button>
          </div>

          {/* Nav */}
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;

              const isActive = item.path
                ? location.pathname === item.path ||
                  location.pathname.startsWith(item.path + "/")
                : false;

              //   if (item.id === "upload") {
              //     return (
              //       <button
              //         key={item.id}
              //         onClick={() => setIsModalOpen(true)}
              //         className="relative group text-left"
              //       >
              //         {/* Item */}
              //         <div
              //           className="
              //   flex items-center gap-4 rounded-lg
              //   py-3 px-3 ml-2
              //   transition-all duration-200
              //   hover:bg-green-50
              // "
              //         >
              //           <Icon className="w-6 h-6 shrink-0 text-gray-500 group-hover:text-green-600" />

              //           <span
              //             className={`
              //     whitespace-nowrap text-[16px]
              //     transition-all duration-200
              //     ${
              //       isCollapsed
              //         ? "opacity-0 w-0 overflow-hidden"
              //         : "opacity-100 text-gray-700 group-hover:text-green-600"
              //     }
              //   `}
              //           >
              //             {item.label}
              //           </span>
              //         </div>

              //         {/* Tooltip */}
              //         {isCollapsed && (
              //           <span className="absolute left-16 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition">
              //             {item.label}
              //           </span>
              //         )}
              //       </button>
              //     );
              //   }

              return (
                <Link
                  key={item.id}
                  to={item.path ?? "#"}
                  className="relative group"
                >
                  {/* Active Indicator */}
                  <span
                    className={`
                absolute left-0 top-1/2 -translate-y-1/2
                h-8 w-1 rounded-r bg-green-600
                transition-all duration-300
                ${isActive ? "opacity-100" : "opacity-0"}
              `}
                  />

                  {/* Item */}
                  <div
                    className={`
                flex items-center gap-4 rounded-lg
                py-3 px-3 ml-2
                transition-all duration-200
                hover:bg-green-50
              `}
                  >
                    {/* Icon */}
                    <Icon
                      className={`
                  w-6 h-6 shrink-0 transition-colors
                  ${
                    isActive
                      ? "text-green-600"
                      : "text-gray-500 group-hover:text-green-600"
                  }
                `}
                    />

                    {/* Label */}
                    <span
                      className={`
                  whitespace-nowrap text-[16px]
                  transition-all duration-200
                  ${
                    isCollapsed
                      ? "opacity-0 w-0 overflow-hidden"
                      : "opacity-100"
                  }
                  ${
                    isActive
                      ? "text-green-600 font-semibold"
                      : "text-gray-700 group-hover:text-green-600"
                  }
                `}
                    >
                      {item.label}
                    </span>
                  </div>

                  {/* Tooltip (Collapsed Only) */}
                  {isCollapsed && (
                    <span
                      className="
                  absolute left-16 top-1/2 -translate-y-1/2
                  bg-gray-900 text-white text-xs
                  px-3 py-1.5 rounded-md
                  opacity-0 group-hover:opacity-100
                  translate-x-2 group-hover:translate-x-0
                  transition-all duration-200
                  pointer-events-none whitespace-nowrap
                  z-50
                "
                    >
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}

            {/* Divider */}
            <div className="my-6 border-t border-gray-200" />

            {/* Logout */}
            <button className="relative group ml-2">
              <div className="flex items-center gap-4 py-3 px-3 rounded-lg hover:bg-green-50">
                <HiOutlineLogout className="w-6 h-6 shrink-0 text-gray-500 group-hover:text-green-600" />

                <span
                  className={`
              transition-all
              ${
                isCollapsed
                  ? "opacity-0 w-0 overflow-hidden"
                  : "opacity-100 text-gray-700"
              }
            `}
                >
                  Log out
                </span>
              </div>

              {isCollapsed && (
                <span className="absolute left-16 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition">
                  Log out
                </span>
              )}
            </button>
          </nav>
        </aside>
      </>

      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onFilesSelected={handleFilesSelected}
      />
    </>
  );
}
