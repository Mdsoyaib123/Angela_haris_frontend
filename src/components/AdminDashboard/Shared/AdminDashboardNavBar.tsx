import { Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useEffect, useRef, useState } from "react";
// import { NotificationPanel } from "@/components/Reuseable/NotificationPanel";
import { useDispatch } from "react-redux";
import { logOut } from "@/redux/features/auth/authSlice";
import { useAuthMeQuery } from "@/redux/features/auth/authApi";

export interface NavbarProps {
  onMobileMenuToggle: () => void;
  notificationCount?: number;
  userName?: string;
  isSidebarOpen: boolean;
}

const AdminDashboardNavBar: React.FC<NavbarProps> = ({
  onMobileMenuToggle,
  isSidebarOpen,
}) => {
  const location = useLocation();
  // const [isOpen, setIsOpen] = useState(false);
  // const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: userData } = useAuthMeQuery();
  const imgUrl: string = userData?.data?.user?.imgUrl ?? "";
  // console.log(imgUrl);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logOut()); // state clear + cookie remove + localStorage remove
    navigate("/login"); // redirect to login page
  };

  // useEffect(() => {
  //   function handleClickOutside(event: MouseEvent) {
  //     if (
  //       dropdownRef.current &&
  //       !dropdownRef.current.contains(event.target as Node)
  //     ) {
  //       setIsOpen(false);
  //     }
  //   }

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);
  const pathTitleMap: Record<string, string> = {
    "admin-dashboard": "Overview",
    "user-and-athletes": "User & Athletes",
    "generate-links": "Network Organizations",
    subscription: "Subscription",
    "media-monitoring": "Media Monitoring",
    notifications: "Notifications",
    settings: "Settings",
    "onboarding-success": "Onboarding Success",
  };
  const segments = location.pathname.split("/").filter(Boolean);
  const segmentAfterBase = segments[1] || segments[0];
  const pageTitle = pathTitleMap[segmentAfterBase] || "Unknown";
  return (
    <div className="bg-white">
      <header
        className={`flex items-center justify-between h-16 px-4 md:px-8 mb-2 ${
          isSidebarOpen ? "container mx-auto" : ""
        }`}
      >
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-black cursor-pointer"
            onClick={onMobileMenuToggle}
          >
            <Menu className="w-6 h-6" />
          </Button>

          {/* Logo + Dashboard text */}
          <div className="flex items-center space-x-2 pl-0 md:pl-2 lg:pl-70">
            <h1 className="text-lg lg:text-3xl font-medium text-black">
              {pageTitle}
            </h1>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Dashboard Icon */}
          {/* <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg transition-colors relative cursor-pointer hover:p-2 hover:bg-gray-100 duration-200"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </button>

            {isOpen && (
              <div className="absolute -right-5 lg:right-0 mt-2 z-10">
                <NotificationPanel />
              </div>
            )}
          </div> */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-600 hover:text-green-600 cursor-pointer"
              >
                {imgUrl ? (
                  <img
                    src={imgUrl}
                    alt="User"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6" />
                )}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="bg-[#0E8701] text-black w-60 shadow-2xl rounded-3xl border border-gray-200 backdrop-blur-md overflow-hidden animate-fadeIn"
            >
              {/* <Link to="/admin-dashboard">
                <DropdownMenuItem className="flex items-center gap-3 px-4 py-2 rounded-3xl hover:bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] hover:brightness-110 hover:text-white transition-colors cursor-pointer">
                  <span className="font-medium">Home</span>
                </DropdownMenuItem>
              </Link> */}

              <Link to="/admin-dashboard/settings">
                <DropdownMenuItem className="flex items-center gap-3 px-4 py-2 rounded-3xl hover:bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] hover:brightness-110 hover:text-white transition-colors cursor-pointer">
                  {/* <IoMdSettings className="text-white hover:text-white transition-colors duration-300 cursor-pointer" /> */}
                  <span className="font-medium">Settings</span>
                </DropdownMenuItem>
              </Link>

              {/* <DropdownMenuItem className="flex items-center gap-3 px-4 py-2 rounded-3xl hover:bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] hover:brightness-110 hover:text-white transition-colors cursor-pointer">
                <span className="font-medium">Terms & Conditions</span>
              </DropdownMenuItem>

              <DropdownMenuItem className="flex items-center gap-3 px-4 py-2 rounded-3xl hover:bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] hover:brightness-110 hover:text-white transition-colors cursor-pointer">
                <span className="font-medium">Privacy Policy</span>
              </DropdownMenuItem> */}

              <DropdownMenuItem
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-2 rounded-3xl hover:bg-red-600 hover:text-black transition-colors cursor-pointer"
              >
                {/* <RiLogoutBoxRLine className="text-red-500" /> */}
                <span className="font-medium">Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </div>
  );
};

export default AdminDashboardNavBar;
