import Footer from "@/components/Landing/Shared/Footer";
import { Navbar } from "@/components/Landing/Shared/Navbar";
import { Outlet, ScrollRestoration } from "react-router-dom";
import ScrollToHashElement from "@/components/Shared/ScrollToHashElement";

export default function LandingPageLayout() {
  return (
    <main>
      <ScrollToHashElement />
      <ScrollRestoration />
      <Navbar className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100/50" />
      <Outlet />
      <Footer />
    </main>
  );
}
