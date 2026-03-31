import React from "react";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import { FaTwitter, FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";

interface ContactInfoCardProps {
  icon: React.ReactNode;
  title: string;
  detail: string;
  subDetail?: string;
  href?: string;
}

const ContactInfoCard: React.FC<ContactInfoCardProps> = ({
  icon,
  title,
  detail,
  subDetail,
  href,
}) => {
  const content = (
    <div className="bg-[#F4FAF6] rounded-3xl p-8 flex flex-col items-center text-center gap-4 shadow-sm border border-emerald-50 hover:shadow-md hover:-translate-y-1 transition-all duration-300 h-full">
      <div className="w-14 h-14 rounded-full bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] flex items-center justify-center text-white shadow-lg">
        {icon}
      </div>
      <div>
        <h3 className="text-base font-bold text-[#323C4B] mb-1">{title}</h3>
        <p className="text-[#11D000] font-semibold text-sm">{detail}</p>
        {subDetail && (
          <p className="text-[#6C7787] text-xs mt-1">{subDetail}</p>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block h-full">
        {content}
      </a>
    );
  }

  return content;
};

const ContactInfo: React.FC = () => {
  const contactCards: ContactInfoCardProps[] = [
    {
      icon: <MdEmail size={24} />,
      title: "Email Us",
      detail: "support@highlightz.com",
      subDetail: "We respond within 24 hours",
      href: "mailto:support@highlightz.com",
    },
    {
      icon: <MdPhone size={24} />,
      title: "Call Us",
      detail: "+1 478-200-5701",
      subDetail: "Mon – Fri, 9am – 6pm EST",
      href: "#",
    },
    {
      icon: <MdLocationOn size={24} />,
      title: "Our Office",
      detail: "Warner Robins, GA",
      subDetail: "United States",
    },
  ];

  const socials = [
    {
      icon: <FaTwitter size={18} />,
      href: "#",
      label: "Twitter",
    },
    {
      icon: <FaInstagram size={18} />,
      href: "#",
      label: "Instagram",
    },
    {
      icon: <FaFacebook size={18} />,
      href: "#",
      label: "Facebook",
    },
    {
      icon: <FaYoutube size={18} />,
      href: "#",
      label: "YouTube",
    },
  ];

  return (
    <div className="flex flex-col gap-10">
      {/* Contact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {contactCards.map((card, idx) => (
          <ContactInfoCard key={idx} {...card} />
        ))}
      </div>

      {/* Social Links */}
      <div className="bg-[#004C21] rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-white shadow-lg">
        <div>
          <h3 className="text-xl font-bold mb-1">Follow Our Journey</h3>
          <p className="text-white/70 text-sm">
            Stay updated with recruiting tips and athlete success stories.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {socials.map((social, idx) => (
            <Link
              key={idx}
              to={social.href}
              aria-label={social.label}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] flex items-center justify-center transition-all duration-300 hover:scale-110 text-white"
            >
              {social.icon}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
