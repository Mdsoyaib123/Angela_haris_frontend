import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import logoIcon from "@/assets/angelaharris/logo-icon.svg";
import logoText from "@/assets/angelaharris/logo-text.svg";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Link, NavLink, useNavigate, useLocation } from "react-router";
import { useAuthMeQuery } from "@/redux/features/auth/authApi";
import { useDispatch } from "react-redux";
import { logOut } from "@/redux/features/auth/authSlice";
import { FaRegUserCircle } from "react-icons/fa";

export interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface Navbar1Props {
  className?: string;
  logo?: {
    url: string;
    src?: string;
    alt?: string;
    className?: string;
  };
  menu?: MenuItem[];
  dropdownMenu?: MenuItem[];
  auth?: {
    login: {
      title: string;
      url: string;
    };
  };
}

const Navbar = ({
  logo = {
    url: "/",
  },
  menu = [
    { title: "Home", url: "/" },

    {
      title: "About Us",
      url: "/about-us",
    },
    {
      title: "How it works",
      url: "/#how-it-works",
    },
    {
      title: "Pricing",
      url: "/#pricing",
    },
    {
      title: "Join Network Program",
      url: "/join-network-program",
    },
    {
      title: "Contact Us",
      url: "/contact-us",
    },
  ],
  auth = {
    login: { title: "Get Started", url: "/signup" },
  },
  className,
}: Navbar1Props) => {
  const { data: userData } = useAuthMeQuery();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const role: string = userData?.data?.user?.role ?? "";
  const imgUrl: string = userData?.data?.user?.imgUrl ?? "";

  const handleLogout = () => {
    dispatch(logOut());
    navigate("/login", { replace: true });
  };
  return (
    <section className={cn("p-4 bg-white lg:px-6 ", className)}>
      <div className="container mx-auto   ">
        {/* Desktop Menu */}
        <nav className="hidden items-center justify-between lg:flex">
          <div className="flex gap-16 items-center">
            {/* Logo */}
            <Link
              className="flex flex-1 flex-col gap-2 items-center"
              to={logo.url}
            >
              <img src={logoIcon} alt="logo" />
              <img src={logoText} alt="logo" />
            </Link>
            <div className="flex items-center justify-center  ">
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item) =>
                    renderMenuItem(item, location.pathname, location.hash),
                  )}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="flex justify-end flex-1 items-center gap-1.5">
            {userData?.data ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-600 size-10 rounded-full hover:text-green-600 cursor-pointer"
                  >
                    {imgUrl ? (
                      <div className="p-0.5">
                        <div className="avatar-inner">
                          <img
                            src={imgUrl}
                            alt="User"
                            className="rounded-full object-fill"
                          />
                        </div>
                      </div>
                    ) : (
                      <FaRegUserCircle className="size-6" />
                    )}
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="bg-[#0E8701] text-black w-60 shadow-2xl rounded-3xl border border-gray-200 backdrop-blur-md overflow-hidden animate-fadeIn"
                >
                  {role !== "ADMIN" && (
                    <Link to={"/profile"}>
                      <DropdownMenuItem className="flex items-center gap-3 px-4 py-2 rounded-3xl hover:bg-red-600 hover:text-white transition-colors cursor-pointer">
                        <span className="font-medium text-white">Profile</span>
                      </DropdownMenuItem>
                    </Link>
                  )}
                  {role === "ADMIN" ? (
                    <Link to="/admin-dashboard">
                      <DropdownMenuItem className="flex items-center gap-3 px-4 py-2 rounded-3xl hover:bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] hover:brightness-110 hover:text-white transition-colors cursor-pointer">
                        <span className="font-medium text-white">
                          Dashboard
                        </span>
                      </DropdownMenuItem>
                    </Link>
                  ) : (
                    <div>
                      <Link to="/user-dashboard">
                        <DropdownMenuItem className="flex items-center gap-3 px-4 py-2 rounded-3xl hover:bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] hover:brightness-110 hover:text-white transition-colors cursor-pointer">
                          <span className="font-medium text-white">
                            Dashboard
                          </span>
                        </DropdownMenuItem>
                      </Link>
                    </div>
                  )}

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-2 rounded-3xl hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                  >
                    <span className="font-medium">Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div>
                <Button
                  className="text-green-600 font-semibold  rounded-full"
                  asChild
                  variant="outline"
                >
                  <Link to={auth.login.url}>{auth.login.title}</Link>
                </Button>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link className="flex flex-col gap-1.5 items-center" to={logo.url}>
              <img src={logoIcon} alt="logo" />
              <img src={logoText} alt="logo" />
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto bg-white border-none">
                <SheetHeader>
                  <SheetTitle>
                    <Link
                      className="flex flex-col gap-1.5 items-center"
                      to={logo.url}
                    >
                      <img src={logoIcon} alt="logo" />
                      <img src={logoText} alt="logo" />
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 p-4">
                  <Accordion
                    type="single"
                    collapsible
                    className="flex w-full flex-col gap-4"
                  >
                    {menu.map((item) =>
                      renderMobileMenuItem(
                        item,
                        location.pathname,
                        location.hash,
                      ),
                    )}
                  </Accordion>

                  <div className="flex flex-col gap-3">
                    {userData?.data ? (
                      <>
                        <Link
                          to={
                            role === "ADMIN"
                              ? "/admin-dashboard"
                              : "/user-dashboard"
                          }
                          className="w-full"
                        >
                          <Button
                            className="w-full text-green-600 rounded-full"
                            variant="outline"
                          >
                            Dashboard
                          </Button>
                        </Link>
                        <Link to={"/profile"} className="w-full">
                          <Button
                            className="w-full text-green-600 rounded-full"
                            variant="outline"
                          >
                            Profile
                          </Button>
                        </Link>
                        <Button
                          onClick={handleLogout}
                          className="w-full text-red-600 rounded-full"
                          variant="outline"
                        >
                          Sign Out
                        </Button>
                      </>
                    ) : (
                      <Button
                        className="text-green-600 rounded-full"
                        asChild
                        variant="outline"
                      >
                        <Link to={auth.login.url}>{auth.login.title}</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

const renderMenuItem = (
  item: MenuItem,
  currentPathname: string,
  currentHash: string,
) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent className="bg-popover text-popover-foreground">
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} />
          ))}
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  const isHashLink = item.url.includes("#");
  const isActive = isHashLink
    ? currentPathname === (item.url.split("#")[0] || "/") &&
      currentHash === `#${item.url.split("#")[1]}`
    : currentPathname === item.url && !currentHash;

  return (
    <NavigationMenuItem key={item.title}>
      <NavLink
        to={item.url}
        end={item.url === "/"}
        className={({ isActive: routerActive }) => {
          const active = isHashLink ? isActive : routerActive;
          return cn(
            "group inline-flex w-max items-center justify-center px-4 py-2 font-semibold hover:bg-linear-to-b hover:from-[#11D000] hover:to-[#0C5302] hover:bg-clip-text hover:text-transparent duration-300",
            active
              ? "bg-linear-to-b from-[#11D000] to-[#0C5302] bg-clip-text text-transparent"
              : "text-[#848D9B]",
          );
        }}
      >
        {item.title}
      </NavLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (
  item: MenuItem,
  currentPathname: string,
  currentHash: string,
) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="-b-0">
        <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  const isHashLink = item.url.includes("#");
  const isActive = isHashLink
    ? currentPathname === (item.url.split("#")[0] || "/") &&
      currentHash === `#${item.url.split("#")[1]}`
    : currentPathname === item.url && !currentHash;

  return (
    <NavLink
      key={item.title}
      to={item.url}
      end={item.url === "/"}
      className={({ isActive: routerActive }) => {
        const active = isHashLink ? isActive : routerActive;
        return cn(
          "group inline-flex w-max items-center justify-center px-4 py-2 font-semibold hover:bg-linear-to-b hover:from-[#11D000] hover:to-[#0C5302] hover:bg-clip-text hover:text-transparent duration-300",
          active
            ? "bg-linear-to-b from-[#11D000] to-[#0C5302] bg-clip-text text-transparent"
            : "text-[#848D9B]",
        );
      }}
    >
      {item.title}
    </NavLink>
  );
};

const SubMenuLink = ({ item }: { item: MenuItem }) => {
  return (
    <NavLink
      to={item.url}
      className={({ isActive }) =>
        cn(
          "group inline-flex w-max items-center justify-center px-4 py-2 font-semibold hover:bg-linear-to-b hover:from-[#11D000] hover:to-[#0C5302] hover:bg-clip-text hover:text-transparent duration-300",
          isActive
            ? "bg-linear-to-b from-[#11D000] to-[#0C5302] bg-clip-text text-transparent"
            : "text-[#848D9B]",
        )
      }
    >
      <div className="text-foreground">{item.icon}</div>
      <div>
        <div className="text-sm font-semibold">{item.title}</div>
        {item.description && (
          <p className="text-sm leading-snug text-muted-foreground">
            {item.description}
          </p>
        )}
      </div>
    </NavLink>
  );
};

export { Navbar };
