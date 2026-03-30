// AdminSidebar.tsx

import logoIcon from "@/assets/angelaharris/logo-icon.svg";
import logoText from "@/assets/angelaharris/logo-text.svg";
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { IconType } from "react-icons";
// import { BiHomeSmile, BiConversation } from "react-icons/bi";
import { LuChartPie, LuUpload } from "react-icons/lu";
// import { TbBellRinging2 } from "react-icons/tb";
import { FaRegUserCircle } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { useAuthMeQuery } from "@/redux/features/auth/authApi";

// Types
export interface SidebarItem {
  icon: IconType;
  label: string;
  href?: string;
  badge?: string;
  children?: { label: string; href: string }[];
}

export interface SidebarProps {
  items?: SidebarItem[];
  onItemClick?: () => void;
}

const HomeSideBar: React.FC<SidebarProps> = ({
  items: propItems,
  onItemClick,
}) => {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const { data: userData } = useAuthMeQuery();
  const role = userData?.data?.user?.role ?? "";

  // Build default items dynamically based on the current role
  const getDefaultItems = (): SidebarItem[] => [
    // {
    //   icon: BiHomeSmile,
    //   label: "Home",
    //   href: "/",
    // },
    {
      icon: FaRegUserCircle,
      label: "Profile",
      href: "/profile",
    },
    // {
    //   icon: BiConversation,
    //   label: "Message",
    //   href: "/message",
    // },
    {
      icon: LuUpload,
      label: "Create Reel",
      href: "/create-reel",
    },
    // {
    //   icon: TbBellRinging2,
    //   label: "Notifications",
    //   href: "/notifications",
    // },

    {
      icon: IoSettingsOutline,
      label: "Settings",
      href:
        role === "ADMIN"
          ? "/admin-dashboard/settings"
          : "/user-dashboard/settings", // fallback while loading
    },
    {
      icon: LuChartPie,
      label: "Return To Dashboard",
      href: role === "ADMIN" ? "/admin-dashboard" : "/user-dashboard", // fallback while loading
    },
  ];

  const items = propItems || getDefaultItems();

  const toggleMenu = (label: string) => {
    setOpenMenu(openMenu === label ? null : label);
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{ boxShadow: "3px 4px 42.3px 0px #0000001A" }}
    >
      {/* Logo */}
      <div className="flex items-center justify-start pl-6 lg:pl-10 pt-5 pb-5 w-full">
        <Link to="/" className="flex flex-col items-center gap-2">
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
                      ${
                        isActive
                          ? "text-white bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] shadow-md"
                          : "text-black hover:text-white hover:bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] hover:shadow-xl"
                      }`}
                  >
                    <div className="flex items-center space-x-2 md:text-lg">
                      <item.icon
                        className={`w-5 h-5 transition-colors duration-300 ${
                          isActive
                            ? "text-white"
                            : "text-black group-hover:text-white"
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <Badge
                        variant="secondary"
                        className="text-xs bg-green-100 text-green-700"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                ) : (
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className="w-full flex items-center justify-between px-4 py-2 text-sm"
                  >
                    <div className="flex items-center space-x-2">
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>

                    {item.children && (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>
                )}

                {item.children && isOpen && (
                  <div className="ml-6 mt-2 space-y-2">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        to={child.href}
                        onClick={onItemClick}
                        className="block px-3 py-2 text-sm rounded-lg hover:bg-gray-100"
                      >
                        {child.label}
                      </Link>
                    ))}
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

export default HomeSideBar;
