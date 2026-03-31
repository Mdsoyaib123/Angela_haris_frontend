// AdminSidebar.tsx
import logoIcon from "@/assets/angelaharris/logo-icon.svg";
import logoText from "@/assets/angelaharris/logo-text.svg";
import { Badge } from "@/components/ui/badge";

// import { RiShareBoxLine } from "react-icons/ri";
import { ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

// import { FaUserPlus, FaUsers } from "react-icons/fa";
// import { TbCalendarUser } from "react-icons/tb";
// import { BiSolidUserBadge } from "react-icons/bi";
// import { HiOutlineUserMinus } from "react-icons/hi2";

import { IconType } from "react-icons";
import { IoCardOutline, IoSettingsOutline } from "react-icons/io5";
import { FiPieChart, FiPlusCircle, FiUsers } from "react-icons/fi";
import { AiOutlineVideoCamera } from "react-icons/ai";
// import { TbBellRinging2 } from "react-icons/tb";

// Types
export interface SidebarItem {
  icon: IconType; // changed from string to IconType
  label: string;
  href?: string;
  badge?: string;
  children?: { label: string; href: string }[];
}

export interface SidebarProps {
  items?: SidebarItem[];
  onItemClick?: () => void;
}

// Sidebar Items
const defaultSidebarItems: SidebarItem[] = [
  // { icon: RxDashboard, label: "Dashboard", href: "/admin-dashboard/dashboard" },
  {
    icon: FiPieChart,
    label: "Overview",
    href: "/admin-dashboard",
  },
  {
    icon: FiUsers,
    label: "User And Athletes",
    href: "/admin-dashboard/user-and-athletes",
  },
  {
    icon: FiPlusCircle,
    label: "Network Organizations",
    href: "/admin-dashboard/generate-links",
  },
  {
    icon: IoCardOutline,
    label: "Subscription",
    href: "/admin-dashboard/subscription",
  },
  {
    icon: AiOutlineVideoCamera,
    label: "Media Monitoring",
    href: "/admin-dashboard/media-monitoring",
  },
  // {
  //   icon: TbBellRinging2,
  //   label: "Notifications",
  //   href: "/admin-dashboard/notifications",
  // },
  {
    icon: IoSettingsOutline,
    label: "Settings",
    href: "/admin-dashboard/settings",
  },
];

const AdminSidebar: React.FC<SidebarProps> = ({
  items = defaultSidebarItems,
  onItemClick,
}) => {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleMenu = (label: string) => {
    setOpenMenu(openMenu === label ? null : label);
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{ boxShadow: "3px 4px 42.3px 0px #0000001A" }}
    >
      {/* Logo */}
      {/* <Link to="/admin-dashboard">
        <div className="flex items-center justify-center p-2 sm:p-3 border-b border-[#C9C6C3] mt-1">
          <div className="flex gap-2">
            <img src={logoIcon} alt="" />
            <img src={logoText} alt="" />
          </div>
        </div>
      </Link> */}
      {/* <Link to="/admin-dashboard" className="flex justify-start">
        <div className="hidden lg:flex flex-col items-center gap-2 p-4">
          <img src={logoIcon} alt="Logo Icon" />
          <img src={logoText} alt="Logo Text" />
        </div>

        Mobile & Tablet → icon + text inline
        <div className="flex lg:hidden items-center gap-2">
          <img src={logoIcon} alt="Logo Icon" />
          <img src={logoText} alt="Logo Text" />
        </div>
      </Link> */}
      {/* Logo */}
      <div className="flex items-center justify-start pl-6 lg:pl-10 pt-5 pb-5 w-full">
        {/* Desktop (lg+) → icon top, text bottom */}
        <Link to="/" className="hidden lg:flex flex-col items-center gap-2">
          <img src={logoIcon} alt="Logo Icon" />
          <img src={logoText} alt="Logo Text" />
        </Link>

        {/* Mobile & Tablet → icon + text inline */}
        <Link to={"/"} className="lg:hidden flex flex-col items-center gap-2">
          <img src={logoIcon} alt="Logo Icon" />
          <img src={logoText} alt="Logo Text" />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 md:p-4">
        <div className="space-y-3">
          {items.map((item) => {
            const isActive =
              location.pathname === item.href ||
              item.children?.some((child) => location.pathname === child.href);
            const isOpen = openMenu === item.label;

            return (
              <div key={item.label}>
                {item.href && !item.children ? (
                  <Link
                    to={item.href}
                    onClick={onItemClick}
                    className={`group flex items-center justify-between w-full px-4 py-2.5 text-sm font-normal rounded-xl
  transition-all duration-300 ease-out cursor-pointer
  ${isActive
                        ? "text-white bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] shadow-md"
                        : "text-black hover:text-white hover:bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] hover:shadow-xl hover:brightness-110"
                      }
  active:translate-y-0 active:shadow-md`}
                  >
                    <div className="flex items-center space-x-2 text-base">
                      <item.icon
                        className={`w-5 h-5 transition-colors duration-300 ${isActive
                            ? "text-white"
                            : "text-black group-hover:text-white"
                          }`}
                      />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                ) : (
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className={`group flex items-center justify-between w-full px-3 py-2 text-sm font-normal transition-all duration-300 ease-in-out cursor-pointer ${isActive
                        ? "text-[#3A5CFF] bg-[#1C1D28] rounded-xl shadow-md"
                        : "text-white hover:text-[#3A5CFF] hover:bg-[#1C1D28]/80 hover:rounded-xl hover:shadow-md"
                      }`}
                  >
                    <div className="flex items-center space-x-2 md:text-lg">
                      <item.icon
                        className={`w-5 h-5 transition-all duration-300 ${isActive
                            ? "text-[#3A5CFF]"
                            : "text-white group-hover:text-[#3A5CFF]"
                          }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.children && (
                      <ChevronDown
                        className={`w-4 h-4 transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                          }`}
                      />
                    )}

                    {item.badge && (
                      <Badge
                        variant="secondary"
                        className="text-xs bg-[#3A5CFF]/10 text-[#3A5CFF] border border-[#3A5CFF]/30"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </button>
                )}

                {item.children && isOpen && (
                  <div className="ml-6 mt-2 space-y-2">
                    {item.children.map((child) => {
                      const childActive = location.pathname === child.href;
                      return (
                        <Link
                          key={child.label}
                          to={child.href}
                          onClick={onItemClick}
                          className={`group block px-3 py-2 text-sm rounded-lg transition-all ${childActive
                              ? "text-[#3A5CFF] bg-[#1C1D28]"
                              : "text-gray-300 hover:text-[#3A5CFF] hover:bg-[#1C1D28]/70"
                            }`}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default AdminSidebar;

// // AdminSidebar.tsx
// import logo from "@/assets/Logo/LogoMain.svg";
// import { Badge } from "@/components/ui/badge";

// import { RiShareBoxLine } from "react-icons/ri";
// import { ChevronDown } from "lucide-react";
// import { Link, useLocation } from "react-router-dom";
// import { useState } from "react";

// import Dashboard from "@/assets/icon/dashboard.svg";
// import UserManagement from "@/assets/icon/UserManagement.svg";
// import Patients from "@/assets/icon/Patients.svg";
// import PatientAssignment from "@/assets/icon/PatientAssignment.svg";
// import ProtocolManagement from "@/assets/icon/ProtocolManagement.svg";
// import AuditLog from "@/assets/icon/AuditLog.svg";
// import Settings from "@/assets/icon/Settings.svg";

// // Types
// export interface SidebarItem {
//   icon: string; // now icon is a string (image src)
//   label: string;
//   href?: string;
//   badge?: string;
//   children?: { label: string; href: string }[];
// }

// export interface SidebarProps {
//   items?: SidebarItem[];
//   onItemClick?: () => void;
// }

// // Sidebar Items
// const defaultSidebarItems: SidebarItem[] = [
//   { icon: Dashboard, label: "Dashboard", href: "/admin-dashboard/dashboard" },
//   {
//     icon: UserManagement,
//     label: "User Management",
//     href: "/admin-dashboard/user-management",
//   },
//   { icon: Patients, label: "Patients", href: "/admin-dashboard/patients" },
//   {
//     icon: PatientAssignment,
//     label: "Patient Assignment",
//     href: "/admin-dashboard/patient-assignment",
//   },
//   {
//     icon: ProtocolManagement,
//     label: "Protocol Management",
//     href: "/admin-dashboard/protocol-management",
//   },
//   { icon: AuditLog, label: "Audit Log", href: "/admin-dashboard/audit-log" },
//   { icon: Settings, label: "Settings", href: "/admin-dashboard/settings" },
// ];

// const AdminSidebar: React.FC<SidebarProps> = ({
//   items = defaultSidebarItems,
//   onItemClick,
// }) => {
//   const location = useLocation();
//   const [openMenu, setOpenMenu] = useState<string | null>(null);

//   const toggleMenu = (label: string) => {
//     setOpenMenu(openMenu === label ? null : label);
//   };

//   return (
//     <div
//       className="flex flex-col h-full bg-[#29424C]"
//       style={{ boxShadow: "3px 4px 42.3px 0px #0000001A" }}
//     >
//       {/* Logo */}
//       <Link to="/admin-dashboard/dashboard">
//         <div className="flex items-center justify-center p-2 sm:p-3 border-b border-[#C9C6C3] mt-1">
//           <div className="flex justify-center mb-1">
//             <img src={logo} alt="Logo" className="h-8 w-35 " />
//           </div>
//         </div>
//       </Link>

//       {/* Navigation */}
//       <nav className="flex-1 p-2 md:p-4">
//         <div className="space-y-4 md:space-y-6">
//           {items.map((item) => {
//             const isActive =
//               location.pathname === item.href ||
//               item.children?.some((child) => location.pathname === child.href);
//             const isOpen = openMenu === item.label;

//             return (
//               <div key={item.label}>
//                 {item.href && !item.children ? (
//                   <Link
//                     to={item.href}
//                     onClick={onItemClick}
//                     className={`flex items-center justify-between w-full px-3 py-2 text-sm font-normal transition-all duration-300 ease-in-out ${
//                       isActive
//                         ? "text-[#F3AA4B] bg-[#FEF7ED] rounded-xl shadow-md"
//                         : "text-white hover:text-[#F3AA4B] hover:bg-[#FEF7ED] hover:rounded-xl hover:shadow-md"
//                     }`}
//                   >
//                     <div className="flex items-center space-x-2 md:text-lg">
//                       <img
//                         src={item.icon}
//                         alt={item.label}
//                         className={`w-5 h-5 transition-colors duration-300 ${
//                           isActive
//                             ? "filter brightness-0 invert sepia saturate-500 hue-rotate-[30deg] text-[#F3AA4B]"
//                             : "filter brightness-0 invert"
//                         } hover:filter hover:brightness-0 hover:invert hover:sepia hover:saturate-500 hover:hue-rotate-[30deg]`}
//                       />
//                       <span>{item.label}</span>
//                     </div>
//                   </Link>
//                 ) : (
//                   <button
//                     onClick={() => toggleMenu(item.label)}
//                     className={`flex items-center justify-between w-full px-3 py-2 text-sm font-normal transition-all duration-300 ease-in-out cursor-pointer ${
//                       isActive
//                         ? "text-[#3A5CFF] bg-[#1C1D28] rounded-xl shadow-md"
//                         : "text-white hover:text-[#3A5CFF] hover:bg-[#1C1D28]/80 hover:rounded-xl hover:shadow-md"
//                     }`}
//                   >
//                     <div className="flex items-center space-x-2 md:text-lg">
//                       <img
//                         src={item.icon}
//                         alt={item.label}
//                         className={`w-5 h-5 transition-all duration-300 ${
//                           isActive ? "filter brightness-125" : ""
//                         }`}
//                       />
//                       <span>{item.label}</span>
//                     </div>

//                     {item.children && (
//                       <ChevronDown
//                         className={`w-4 h-4 transform transition-transform duration-300 ${
//                           isOpen ? "rotate-180" : ""
//                         }`}
//                       />
//                     )}

//                     {item.badge && (
//                       <Badge
//                         variant="secondary"
//                         className="text-xs bg-[#3A5CFF]/10 text-[#3A5CFF] border border-[#3A5CFF]/30"
//                       >
//                         {item.badge}
//                       </Badge>
//                     )}
//                   </button>
//                 )}

//                 {item.children && isOpen && (
//                   <div className="ml-6 mt-2 space-y-2">
//                     {item.children.map((child) => {
//                       const childActive = location.pathname === child.href;
//                       return (
//                         <Link
//                           key={child.label}
//                           to={child.href}
//                           onClick={onItemClick}
//                           className={`block px-3 py-2 text-sm rounded-lg transition-all ${
//                             childActive
//                               ? "text-[#3A5CFF] bg-[#1C1D28]"
//                               : "text-gray-300 hover:text-[#3A5CFF] hover:bg-[#1C1D28]/70"
//                           }`}
//                         >
//                           {child.label}
//                         </Link>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </nav>

//       {/* Help & Support */}
//       <div className="p-2 md:p-4 border-t border-[#C9C6C3]">
//         <div className="flex justify-center mb-1">
//           <img src={logo} alt="Logo" className="h-5 w-auto" />
//         </div>
//         <Link
//           to="/client-dashboard/help-support"
//           className="flex items-center justify-center space-x-3 text-white hover:text-[#3A5BF8] transition-colors"
//         >
//           <span className="text-sm font-medium">Help & Support</span>
//           <RiShareBoxLine className="w-5 h-5 text-gray-300" />
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default AdminSidebar;
