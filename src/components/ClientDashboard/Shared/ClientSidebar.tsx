// ClientSideBar.tsx
import { Badge } from "@/components/ui/badge";
// import { RiShareBoxLine } from "react-icons/ri";
import { ChevronDown, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { GoCreditCard } from "react-icons/go";
import { IconType } from "react-icons";
import { IoSettingsOutline } from "react-icons/io5";
import { LuChartPie } from "react-icons/lu";
import logoIcon from "@/assets/angelaharris/logo-icon.svg";
import logoText from "@/assets/angelaharris/logo-text.svg";
// import { PiKeyReturn } from "react-icons/pi";

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
  {
    icon: LuChartPie,
    label: "Dashboard",
    href: "/user-dashboard",
  },
  // {
  //   icon: LuChartPie,
  //   label: "Profile",
  //   href: "/profile",
  // },
  {
    icon: GoCreditCard,
    label: "Subscription",
    href: "/user-dashboard/subscription",
  },
  {
    icon: GoCreditCard,
    label: "Subscription and Billing",
    href: "/user-dashboard/subscription-and-billing",
  },
  {
    icon: IoSettingsOutline,
    label: "Account Settings",
    href: "/user-dashboard/settings",
  },
  {
    icon: Home,
    label: "Return to Profile",
    href: "/profile",
  },
];

const ClientSidebar: React.FC<SidebarProps> = ({
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
      className="flex flex-col h-full "
      style={{ boxShadow: "3px 4px 42.3px 0px #0000001A" }}
    >
      {/* Logo */}
      {/* <Link to="/user-dashboard">
        <div className="flex items-center justify-center p-2 sm:p-3 border-b border-[#C9C6C3] mt-1">
          <div className="flex gap-2">
            <img src={logoIcon} alt="" />
            <img src={logoText} alt="" />
          </div>
        </div>
      </Link> */}
      {/* <Link to="/user-dashboard" className=" flex justify-start">
        <div className="hidden lg:flex flex-col items-center gap-2 p-4 ">
          <img src={logoIcon} alt="Logo Icon" />
          <img src={logoText} alt="Logo Text" />
        </div>

        Mobile & Tablet → icon + text inline
        <div className="flex lg:hidden items-center gap-2">
          <img src={logoIcon} alt="Logo Icon" />
          <img src={logoText} alt="Logo Text" />
        </div>
      </Link> */}

      <div className="flex items-center justify-start pl-6 lg:pl-10 pt-5 pb-5 w-full">
        {/* Desktop (lg+) → icon top, text bottom */}
        <Link to={"/"} className="hidden lg:flex flex-col items-center gap-2">
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
      <nav className="flex-1 p-2 md:p-2">
        <div className="space-y-3 ">
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
                    className={`group flex items-center justify-between w-full px-2 py-2.5 text-sm font-normal rounded-xl
  transition-all duration-300 ease-out cursor-pointer
  ${
    isActive
      ? "text-white bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] shadow-md"
      : "text-black hover:text-white hover:bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] hover:shadow-xl hover:brightness-110"
  }
  active:translate-y-0 active:shadow-md`}
                  >
                    <div className="flex items-center space-x-2 md:text-lg">
                      <item.icon
                        className={`w-5 h-5 transition-colors duration-300 ${
                          isActive
                            ? "text-white"
                            : "text-black group-hover:text-white"
                        }`}
                      />
                      <span className="transition-colors duration-300 whitespace-nowrap">
                        {item.label}
                      </span>
                    </div>
                  </Link>
                ) : (
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className={`group flex items-center justify-between w-full px-3 py-2 text-sm font-normal transition-all duration-300 ease-in-out cursor-pointer ${
                      isActive
                        ? "text-[#3A5CFF] bg-[#1C1D28] rounded-xl shadow-md"
                        : "text-white hover:text-[#3A5CFF] hover:bg-[#1C1D28]/80 hover:rounded-xl hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-center space-x-2 md:text-lg">
                      <item.icon
                        className={`w-5 h-5 transition-all duration-300 ${
                          isActive
                            ? "text-[#3A5CFF]"
                            : "text-white group-hover:text-[#3A5CFF]"
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.children && (
                      <ChevronDown
                        className={`w-4 h-4 transform transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
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
                          className={`group block px-3 py-2 text-sm rounded-lg transition-all ${
                            childActive
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

export default ClientSidebar;
