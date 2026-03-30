import ContactCTA from "@/components/Landing/ContactUs/ContactCTA";
import ContactForm from "@/components/Landing/ContactUs/ContactForm";
import ContactHero from "@/components/Landing/ContactUs/ContactHero";
import ContactInfo from "@/components/Landing/ContactUs/ContactInfo";

export default function ContactUsPage() {
  return (
    <>
      <ContactHero />
      <section className="bg-white py-16 px-6 font-sans">
        <div className="container mx-auto space-y-12">
          <ContactInfo />
          <ContactForm />
        </div>
      </section>
      <ContactCTA />
    </>
  );
}
