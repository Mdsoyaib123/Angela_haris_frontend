/* eslint-disable @typescript-eslint/no-explicit-any */
import { X, Link, Loader2, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useCreateOrganizationMutation } from "@/redux/features/organization/organizationApi";
import { toast } from "sonner";
import { countries, currencies } from "@/utils/countryData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GenerateAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialFormState = {
  organizationCode: "",
  name: "",
  email: "",
  contactPhone: "",
  website: "",
  country: "US",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  bankAccountHolderName: "",
  bankName: "",
  bankAccountLast4: "",
  bankRoutingLast4: "",
  bankCountry: "US",
  bankCurrency: "usd",
};

export default function GenerateAccessModal({
  isOpen = false,
  onClose,
}: GenerateAccessModalProps) {
  const [form, setForm] = useState(initialFormState);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);

  const [createOrganization, { isLoading }] = useCreateOrganizationMutation();

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    let { name, value } = e.target;

    if (name === "contactPhone") {
      // Format: (xxx)xxx-xxxx
      const x = value.replace(/\D/g, "").match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
      if (x) {
        value = !x[2]
          ? x[1]
          : "(" + x[1] + ")" + x[2] + (x[3] ? "-" + x[3] : "");
      }
    }

    if (name === "website") {
      // If the user pasted a full URL, we'll keep it as is
      // Otherwise, we'll prefix it in handleWebsiteBlur
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleWebsiteBlur = () => {
    if (form.website && !/^https?:\/\//i.test(form.website)) {
      setForm((prev) => ({ ...prev, website: `https://${form.website}` }));
    }
  };

  const handleClose = () => {
    setForm(initialFormState);
    setGeneratedLink(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Required fields validation
    const requiredFields = [
      "organizationCode",
      "name",
      "email",
      "contactPhone",
      "website",
      "country",
      "addressLine1",
      "city",
      "state",
      "postalCode",
      "bankAccountHolderName",
      "bankName",
      "bankAccountLast4",
      "bankRoutingLast4",
      "bankCountry",
      "bankCurrency",
    ];

    for (const field of requiredFields) {
      if (!form[field as keyof typeof form].trim()) {
        toast.error(`${field.replace(/([A-Z])/g, " $1")} is required.`);
        return;
      }
    }

    try {
      const result = await createOrganization({
        ...form,
        organizationCode: form.organizationCode.trim(),
        name: form.name.trim(),
        email: form.email.trim(),
      }).unwrap();

      const onboardingUrl = result.organization.onBoardingLink;

      setGeneratedLink(result.organization.accessUrl);

      toast.success("Organization link generated successfully!");

      // Redirect to Stripe onboarding
      if (onboardingUrl) {
        window.location.href = onboardingUrl;
      }
    } catch (err: any) {
      const message =
        err?.data?.message ?? "Failed to generate link. Please try again.";
      toast.error(message);
    }
  };

  const handleCopy = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
        onClick={handleClose}
      />

      {/* Modal Card */}
      <div
        className="relative w-full max-w-3xl rounded-lg bg-gray-50 max-h-[90vh] shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between bg-gray-50 px-6 pt-6 pb-4 border-b border-[#C6CAD1]">
          <h2 className="text-lg font-semibold text-gray-800">
            Network Organizations
          </h2>
          <button
            onClick={handleClose}
            className="text-[#28303F] cursor-pointer"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 py-4 overflow-y-auto overscroll-contain flex-1">
          {!generatedLink ? (
            <form
              id="create-org-form"
              onSubmit={handleSubmit}
              className="space-y-8"
            >
              {/* Organization Details Section */}
              <section>
                <h3 className="text-base font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">
                  Organization Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <label className="block mb-1.5 text-xs uppercase text-[#475569] font-semibold">
                      Organization Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. example organization"
                      required
                      className="w-full rounded-lg bg-white border border-[#E2E8F0] px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500/50 transition"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block mb-1.5 text-xs uppercase text-[#475569] font-semibold">
                      Organization Code
                    </label>
                    <input
                      type="text"
                      name="organizationCode"
                      value={form.organizationCode}
                      onChange={handleChange}
                      placeholder="e.g. ORG_009"
                      required
                      className="w-full rounded-lg bg-white border border-[#E2E8F0] px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500/50 transition"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block mb-1.5 text-xs uppercase text-[#475569] font-semibold">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="org@example.com"
                      required
                      className="w-full rounded-lg bg-white border border-[#E2E8F0] px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500/50 transition"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block mb-1.5 text-xs uppercase text-[#475569] font-semibold">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      name="contactPhone"
                      value={form.contactPhone}
                      onChange={handleChange}
                      placeholder="(xxx)xxx-xxxx"
                      required
                      className="w-full rounded-lg bg-white border border-[#E2E8F0] px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500/50 transition"
                    />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="block mb-1.5 text-xs uppercase text-[#475569] font-semibold">
                      Website
                    </label>
                    <div className="flex rounded-lg border border-[#E2E8F0] bg-white overflow-hidden focus-within:ring-2 focus-within:ring-green-500/30 focus-within:border-green-500/50 transition">
                      <div className="flex items-center px-3 bg-gray-50 border-r border-[#E2E8F0] text-sm text-gray-500 select-none">
                        https://
                      </div>
                      <input
                        type="text"
                        name="website"
                        value={form.website.replace(/^https?:\/\//i, "")}
                        onChange={(e) => {
                          const val = e.target.value;
                          setForm((prev) => ({
                            ...prev,
                            website: val.startsWith("http")
                              ? val
                              : `https://${val}`,
                          }));
                        }}
                        onBlur={handleWebsiteBlur}
                        placeholder="www.highlightzapp.com"
                        required
                        className="w-full px-4 py-2.5 text-sm text-gray-700 focus:outline-none bg-transparent"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Address Information Section */}
              <section>
                <h3 className="text-base font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">
                  Address Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <label className="block mb-1.5 text-xs uppercase text-[#475569] font-semibold">
                      Country
                    </label>
                    <Select
                      value={form.country}
                      disabled
                      onValueChange={(value) =>
                        setForm((prev) => ({ ...prev, country: value }))
                      }
                    >
                      <SelectTrigger className="w-full rounded-lg bg-white border border-[#E2E8F0] px-4 py-2.5 text-sm text-gray-700 [&>svg]:hidden">
                        <SelectValue placeholder="Select Country" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {countries.map((country) => (
                          <SelectItem key={country.value} value={country.value}>
                            {country.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-1">
                    <label className="block mb-1.5 text-xs uppercase text-[#475569] font-semibold">
                      Address Line 1
                    </label>
                    <input
                      type="text"
                      name="addressLine1"
                      value={form.addressLine1}
                      onChange={handleChange}
                      placeholder="123 Main St"
                      required
                      className="w-full rounded-lg bg-white border border-[#E2E8F0] px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500/50 transition"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block mb-1.5 text-xs uppercase text-[#475569] font-semibold">
                      Address Line 2 (Optional)
                    </label>
                    <input
                      type="text"
                      name="addressLine2"
                      value={form.addressLine2}
                      onChange={handleChange}
                      placeholder="Suite 10"
                      className="w-full rounded-lg bg-white border border-[#E2E8F0] px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500/50 transition"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block mb-1.5 text-xs uppercase text-[#475569] font-semibold">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="New York"
                      required
                      className="w-full rounded-lg bg-white border border-[#E2E8F0] px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500/50 transition"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block mb-1.5 text-xs uppercase text-[#475569] font-semibold">
                      State / Province
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      placeholder="NY"
                      required
                      className="w-full rounded-lg bg-white border border-[#E2E8F0] px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500/50 transition"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block mb-1.5 text-xs uppercase text-[#475569] font-semibold">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={form.postalCode}
                      onChange={handleChange}
                      placeholder="10001"
                      required
                      className="w-full rounded-lg bg-white border border-[#E2E8F0] px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500/50 transition"
                    />
                  </div>
                </div>
              </section>

              {/* Bank Details Section */}
              <section>
                <h3 className="text-base font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">
                  Bank Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <label className="block mb-1.5 text-xs uppercase text-[#475569] font-semibold">
                      Account Holder Name
                    </label>
                    <input
                      type="text"
                      name="bankAccountHolderName"
                      value={form.bankAccountHolderName}
                      onChange={handleChange}
                      placeholder="Softvence Academy"
                      required
                      className="w-full rounded-lg bg-white border border-[#E2E8F0] px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500/50 transition"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block mb-1.5 text-xs uppercase text-[#475569] font-semibold">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      name="bankName"
                      value={form.bankName}
                      onChange={handleChange}
                      placeholder="Bank of America"
                      required
                      className="w-full rounded-lg bg-white border border-[#E2E8F0] px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500/50 transition"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block mb-1.5 text-xs uppercase text-[#475569] font-semibold">
                      Account Number (Last 4)
                    </label>
                    <input
                      type="text"
                      name="bankAccountLast4"
                      value={form.bankAccountLast4}
                      onChange={handleChange}
                      placeholder="6789"
                      maxLength={4}
                      required
                      className="w-full rounded-lg bg-white border border-[#E2E8F0] px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500/50 transition"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block mb-1.5 text-xs uppercase text-[#475569] font-semibold">
                      Routing Number (Last 4)
                    </label>
                    <input
                      type="text"
                      name="bankRoutingLast4"
                      value={form.bankRoutingLast4}
                      onChange={handleChange}
                      placeholder="0210"
                      maxLength={4}
                      required
                      className="w-full rounded-lg bg-white border border-[#E2E8F0] px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500/50 transition"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block mb-1.5 text-xs uppercase text-[#475569] font-semibold">
                      Bank Country
                    </label>
                    <Select
                      disabled
                      value={form.bankCountry}
                      onValueChange={(value) =>
                        setForm((prev) => ({ ...prev, bankCountry: value }))
                      }
                    >
                      <SelectTrigger className="w-full rounded-lg bg-white border border-[#E2E8F0] px-4 py-2.5 text-sm text-gray-700 [&>svg]:hidden">
                        <SelectValue placeholder="Select Bank Country" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {countries.map((country) => (
                          <SelectItem key={country.value} value={country.value}>
                            {country.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-1">
                    <label className="block mb-1.5 text-xs uppercase text-[#475569] font-semibold">
                      Bank Currency
                    </label>
                    <Select
                      disabled
                      value={form.bankCurrency}
                      onValueChange={(value) =>
                        setForm((prev) => ({ ...prev, bankCurrency: value }))
                      }
                    >
                      <SelectTrigger className="w-full rounded-lg bg-white border border-[#E2E8F0] px-4 py-2.5 text-sm text-gray-700 [&>svg]:hidden">
                        <SelectValue placeholder="Select Currency" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {currencies.map((currency) => (
                          <SelectItem
                            key={currency.value}
                            value={currency.value}
                          >
                            {currency.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </section>
            </form>
          ) : (
            /* Success State — show generated link */
            <div className="flex flex-col items-center gap-4 py-8">
              <CheckCircle className="text-green-600 w-16 h-16" />
              <div className="text-center">
                <p className="text-gray-800 font-bold text-xl mb-1">
                  Organization Created!
                </p>
                <p className="text-gray-500 text-sm">
                  The access link for {form.name} is ready.
                </p>
              </div>
              <div className="w-full rounded-xl bg-green-50 border border-green-100 p-4 mt-2 flex items-center gap-3">
                <Link className="text-green-600 w-5 h-5 shrink-0" />
                <a
                  href={generatedLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-green-700 break-all hover:underline flex-1"
                >
                  {generatedLink}
                </a>
              </div>
              <div className="flex flex-col w-full gap-3 mt-4">
                <button
                  onClick={handleCopy}
                  className="w-full rounded-full bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] px-4 py-3 font-semibold text-white hover:brightness-110 shadow-lg shadow-green-200 transition cursor-pointer"
                >
                  Copy Link
                </button>
                <button
                  onClick={handleClose}
                  className="w-full px-4 py-2 text-sm text-gray-500 hover:text-gray-700 font-medium transition cursor-pointer"
                >
                  Close & Return
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer — only shown in form state */}
        {!generatedLink && (
          <div className="sticky bottom-0 z-20 bg-gray-50 px-4 sm:px-6 py-4 border-t border-[#EFEEEE] shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
            <button
              type="submit"
              form="create-org-form"
              disabled={isLoading}
              className="w-full rounded-full bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] px-4 py-3 font-semibold text-white hover:brightness-110 shadow-lg shadow-green-200 transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Organization...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
