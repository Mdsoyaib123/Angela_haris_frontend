import ClientDashboardNavbar from "@/components/ClientDashboard/Shared/ClientDashboardNavbar";
import ClientSidebar from "@/components/ClientDashboard/Shared/ClientSidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";

const ClientLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { pathname } = useLocation();

  const shouldHideNavbar = pathname === "/user-dashboard/invoice-form";

  const shouldHideSidebar = () => {
    const hideExact = ["/user-dashboard/add-product"];

    const pathnameSegments = pathname.split("/");

    const isProductDetails =
      pathname.startsWith("/user-dashboard/all-products/") &&
      pathnameSegments.length === 4;

    const isOrderDetails =
      pathname.startsWith("/user-dashboard/all-orders/") &&
      pathnameSegments.length === 4;

    const isBuyerProfile =
      pathname.startsWith("/user-dashboard/all-orders/") &&
      pathnameSegments.length === 5 &&
      pathname.endsWith("/buyer-profile");

    return (
      hideExact.includes(pathname) ||
      isProductDetails ||
      isOrderDetails ||
      isBuyerProfile
    );
  };

  useEffect(() => {
    const pathnameSegments = pathname.split("/");

    const isDetailView =
      (pathname.startsWith("/user-dashboard/all-products/") &&
        pathnameSegments.length === 4) ||
      (pathname.startsWith("/user-dashboard/all-orders/") &&
        pathnameSegments.length === 4) ||
      (pathname.startsWith("/user-dashboard/all-orders/") &&
        pathnameSegments.length === 5 &&
        pathname.endsWith("/buyer-profile"));

    const isAddProduct = pathname === "/user-dashboard/add-product";
    const isAllProduct = pathname === "/user-dashboard/all-products";
    const isAllOrder = pathname === "/user-dashboard/all-orders";
    const isInquiries = pathname === "/user-dashboard/inquiries-details";
    const isInvoice = pathname === "/user-dashboard/invoice-form";

    setIsSidebarOpen(
      isDetailView ||
        isAddProduct ||
        isAllProduct ||
        isAllOrder ||
        isInquiries ||
        isInvoice,
    );
  }, [pathname]);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex min-h-screen bg-linear-to-r from-[#052318] via-[#0A1C19] to-[#0F131B]">
      {/* Sidebar - Fixed on Desktop */}
      {!shouldHideSidebar() && (
        <div className="hidden lg:flex w-72 flex-col fixed inset-y-0 z-30 bg-white ">
          <ClientSidebar />
        </div>
      )}

      {/* Main Content */}
      <div
        className={`flex flex-col flex-1 transition-all duration-200 ease-in-out ${
          !shouldHideSidebar() ? "lg:ml-72" : ""
        }`}
      >
        {/* Navbar */}
        {!shouldHideNavbar && (
          <div className="fixed top-0 left-0 right-0 z-20 bg-white ">
            <ClientDashboardNavbar
              onMobileMenuToggle={handleMobileMenuToggle}
              notificationCount={3}
              isSidebarOpen={isSidebarOpen}
            />
          </div>
        )}

        {/* Mobile Sidebar */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <div className="hidden" />
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 bg-white">
            <ClientSidebar onItemClick={() => setIsMobileMenuOpen(false)} />
          </SheetContent>
        </Sheet>

        {/* Scrollable Page Content */}
        <main
          className={`flex-1 overflow-y-auto mt-8 md:mt-16 text-black bg-white ${
            isSidebarOpen ? "pt-20 md:pt-24" : "p-4 md:p-10 pt-20"
          }`}
        >
          <Outlet />
          <ScrollRestoration key={pathname} />
        </main>
      </div>
    </div>
  );
};

export default ClientLayout;
