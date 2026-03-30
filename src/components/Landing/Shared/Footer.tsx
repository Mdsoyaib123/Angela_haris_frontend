import React from "react";
import { Link } from "react-router-dom";
import logoIcon from "@/assets/angelaharris/logo-icon.svg";
import logoText from "@/assets/angelaharris/logo-text.svg";

const Footer: React.FC = () => {
  const legalLinks = [
    { name: "Terms of Service", href: "#" },
    { name: "Privacy Policy", href: "#" },
    { name: "DMCA / Copyright Policy", href: "#" },
    { name: "Athlete Safety Policy", href: "#" },
    { name: "Cookie Policy", href: "#" },
    { name: "Consent & Media", href: "#" },
    { name: "COPPA Compliance Notice", href: "#" },
  ];

  return (
    <footer className="bg-[#004C21] text-white py-12 px-4 font-sans">
      <div className="container mx-auto flex flex-col ">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2">
            {/* Simple SVG representation of the 'H' logo */}
            <Link to={"/"} className="flex flex-col items-center gap-2">
              <img src={logoIcon} alt="Logo Icon" />
              <img src={logoText} alt="Logo Text" />
            </Link>
          </div>
        </div>

        {/* Legal Heading */}
        <h3 className="text-base font-semibold mb-8 tracking-wide text-center">
          Legal
        </h3>

        {/* Links Grid/Row */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-12 text-center">
          {legalLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="text-[14px] md:text-xs text-[#EFEEEE] hover:text-white transition-colors duration-200  leading-tight"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Copyright Notice */}
        <div className="text-[16px] text-[#E6F6ED] text-center">
          © {new Date().getFullYear()} Highlightz. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
