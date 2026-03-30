import {
  X,
  Globe,
  Phone,
  Mail,
  Link,
  Wallet,
  Percent,
  Camera,
  Loader2,
  ExternalLink,
  Users,
  Calendar,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  useUpdateOrganizationMutation,
  useGetOrganizationByIdQuery,
} from "@/redux/features/organization/organizationApi";
import { format } from "date-fns";
import { toast } from "sonner";
import { countries, currencies } from "@/utils/countryData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UpdateActionModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  orgData?: any;
}

export default function UpdateActionModal({
  isOpen = false,
  onClose,
  orgData,
}: UpdateActionModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [updateOrganization, { isLoading: isUpdating }] =
    useUpdateOrganizationMutation();
  const { data: detailedData, isLoading: isLoadingDetails } =
    useGetOrganizationByIdQuery(orgData?.id, {
      skip: !orgData?.id || !isOpen,
    });

  useEffect(() => {
    if (orgData) {
      setFormData({
        organizationName: orgData.organizationName || "",
        email: orgData.email || "",
        contactPhone: orgData.contactPhone || "",
        website: orgData.website || "",
        country: orgData.country || "",
        addressLine1: orgData.addressLine1 || "",
        addressLine2: orgData.addressLine2 || "",
        city: orgData.city || "",
        state: orgData.state || "",
        postalCode: orgData.postalCode || "",
        bankAccountHolderName: orgData.bankAccountHolderName || "",
        bankName: orgData.bankName || "",
        bankAccountLast4: orgData.bankAccountLast4 || "",
        bankRoutingLast4: orgData.bankRoutingLast4 || "",
        bankCountry: orgData.bankCountry || "",
        bankCurrency: orgData.bankCurrency || "",
      });
      setImagePreview(orgData.imaageUrl);
    }
  }, [orgData]);

  if (!isOpen || !orgData) return null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          data.append(key, formData[key]);
        }
      });
      if (imageFile) {
        data.append("image", imageFile);
      }

      await updateOrganization({ id: orgData.id, body: data }).unwrap();
      toast.success("Organization updated successfully!");
      setIsEditing(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update organization");
    }
  };

  const profileImage = imagePreview;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 lg:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        className="relative w-full max-w-3xl rounded-xl bg-gray-50 max-h-[90vh] overflow-y-auto overscroll-contain shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header (Sticky) */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between
                    bg-gray-50 px-6 pt-6 pb-4 border-b border-[#C6CAD1]"
        >
          <h2 className="text-xl font-bold text-gray-800">
            {isEditing ? "Edit Organization" : "Organization Overview"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors p-1"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-8">
          {isEditing ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
              {/* Image Upload Section */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-center gap-4">
                <div className="relative group">
                  <div className="h-36 w-36 rounded-2xl overflow-hidden shadow-xl border-4 border-white transition-transform group-hover:scale-[1.02] duration-300">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-600 uppercase">
                        {formData.organizationName?.charAt(0) ||
                          orgData.organizationName?.charAt(0) ||
                          "O"}
                      </div>
                    )}
                  </div>
                  <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white rounded-2xl opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-[2px]">
                    <Camera size={28} className="mb-1" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Change Logo
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-gray-800">
                    Organization Logo
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mt-0.5">
                    Recommended: Square 400x400px
                  </p>
                </div>
              </div>

              {/* Form Sections */}
              <div className="space-y-6">
                {/* Basic Info Card */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
                  <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <Globe size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-800">
                        Basic Information
                      </h4>
                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">
                        Public profile and contact details
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5 md:col-span-2 flex flex-col">
                      <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest ml-1">
                        Organization Name
                      </label>
                      <input
                        name="organizationName"
                        value={formData.organizationName}
                        onChange={handleInputChange}
                        placeholder="Enter organization name"
                        className="w-full bg-gray-50/50 border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-gray-300"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest ml-1">
                        Website URL
                      </label>
                      <div className="relative">
                        <Globe
                          size={14}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                        />
                        <input
                          name="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          placeholder="https://..."
                          className="w-full bg-gray-50/50 border-2 border-gray-100 rounded-xl pl-10 pr-4 py-3 text-sm font-bold text-gray-700 focus:outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-gray-300"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest ml-1">
                        Contact Phone
                      </label>
                      <div className="relative">
                        <Phone
                          size={14}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                        />
                        <input
                          name="contactPhone"
                          value={formData.contactPhone}
                          onChange={handleInputChange}
                          placeholder="+1 (555) 000-0000"
                          className="w-full bg-gray-50/50 border-2 border-gray-100 rounded-xl pl-10 pr-4 py-3 text-sm font-bold text-gray-700 focus:outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-gray-300"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Details Card */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
                  <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                      <Mail size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-800">
                        Address Details
                      </h4>
                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">
                        Physical location and mailing address
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="space-y-1.5 md:col-span-2 flex flex-col">
                      <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest ml-1">
                        Street Address
                      </label>
                      <input
                        name="addressLine1"
                        value={formData.addressLine1}
                        onChange={handleInputChange}
                        placeholder="123 Main St"
                        className="w-full bg-gray-50/50 border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:outline-none focus:border-purple-500 focus:bg-white transition-all placeholder:text-gray-300"
                      />
                    </div>
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest ml-1">
                        City
                      </label>
                      <input
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="New York"
                        className="w-full bg-gray-50/50 border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:outline-none focus:border-purple-500 focus:bg-white transition-all placeholder:text-gray-300"
                      />
                    </div>
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest ml-1">
                        State / Province
                      </label>
                      <input
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="NY"
                        className="w-full bg-gray-50/50 border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:outline-none focus:border-purple-500 focus:bg-white transition-all placeholder:text-gray-300"
                      />
                    </div>
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-[10px] uppercase  font-black text-gray-400 tracking-widest ml-1">
                        Country
                      </label>
                      <Select
                        disabled
                        value={formData.country}
                        onValueChange={(value) =>
                          setFormData((prev: any) => ({
                            ...prev,
                            country: value,
                          }))
                        }
                      >
                        <SelectTrigger className="w-full bg-gray-50/50 border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:ring-0 focus:ring-offset-0 [&>svg]:hidden transition-all ">
                          <SelectValue placeholder="Select Country" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {countries.map((country) => (
                            <SelectItem
                              key={country.value}
                              value={country.value}
                            >
                              {country.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest ml-1">
                        Postal Code
                      </label>
                      <input
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        placeholder="10001"
                        className="w-full bg-gray-50/50 border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:outline-none focus:border-purple-500 focus:bg-white transition-all placeholder:text-gray-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Bank Info Card */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6 pb-8">
                  <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                    <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                      <Wallet size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-800">
                        Payment & Bank Details
                      </h4>
                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">
                        Payout destination and banking information
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest ml-1">
                        Bank Name
                      </label>
                      <input
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleInputChange}
                        placeholder="e.g. Chase Bank"
                        className="w-full bg-gray-50/50 border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:outline-none focus:border-green-500 focus:bg-white transition-all placeholder:text-gray-300"
                      />
                    </div>
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest ml-1">
                        Account Holder
                      </label>
                      <input
                        name="bankAccountHolderName"
                        value={formData.bankAccountHolderName}
                        onChange={handleInputChange}
                        placeholder="Name on account"
                        className="w-full bg-gray-50/50 border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:outline-none focus:border-green-500 focus:bg-white transition-all placeholder:text-gray-300"
                      />
                    </div>
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest ml-1">
                        Account (Last 4)
                      </label>
                      <input
                        name="bankAccountLast4"
                        value={formData.bankAccountLast4}
                        onChange={handleInputChange}
                        maxLength={4}
                        placeholder="1234"
                        className="w-full bg-gray-50/50 border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:outline-none focus:border-green-500 focus:bg-white transition-all placeholder:text-gray-300"
                      />
                    </div>
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest ml-1">
                        Routing (Last 4)
                      </label>
                      <input
                        name="bankRoutingLast4"
                        value={formData.bankRoutingLast4}
                        onChange={handleInputChange}
                        maxLength={4}
                        placeholder="5678"
                        className="w-full bg-gray-50/50 border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:outline-none focus:border-green-500 focus:bg-white transition-all placeholder:text-gray-300"
                      />
                    </div>
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest ml-1">
                        Bank Country
                      </label>
                      <Select
                        disabled
                        value={formData.bankCountry}
                        onValueChange={(value) =>
                          setFormData((prev: any) => ({
                            ...prev,
                            bankCountry: value,
                          }))
                        }
                      >
                        <SelectTrigger className="w-full bg-gray-50/50 border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:ring-0 focus:ring-offset-0 [&>svg]:hidden transition-all">
                          <SelectValue placeholder="Select Bank Country" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {countries.map((country) => (
                            <SelectItem
                              key={country.value}
                              value={country.value}
                            >
                              {country.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest ml-1">
                        Bank Currency
                      </label>
                      <Select
                        disabled
                        value={formData.bankCurrency}
                        onValueChange={(value) =>
                          setFormData((prev: any) => ({
                            ...prev,
                            bankCurrency: value,
                          }))
                        }
                      >
                        <SelectTrigger className="w-full bg-gray-50/50 border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:ring-0 focus:ring-offset-0 transition-all [&>svg]:hidden">
                          <SelectValue placeholder="Select Bank Currency" />
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
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Profile & Basic Info Section */}
              <section className="flex flex-col md:flex-row gap-6 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                {/* {profileImage ? (
                  <img
                    src={profileImage}
                    alt={orgData.organizationName}
                    className="h-24 w-24 rounded-2xl object-cover shrink-0 shadow-md border-2 border-white"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-2xl bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-600 uppercase shrink-0 shadow-md border-2 border-white">
                    {orgData.organizationName?.charAt(0) || "O"}
                  </div>
                )} */}

                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-bold text-gray-900 truncate">
                      {orgData.organizationName}
                    </h3>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wider">
                      {orgData.organizationCode}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 pt-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail size={16} className="text-gray-400" />
                      <span className="truncate">{orgData.email}</span>
                    </div>
                    {orgData.contactPhone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone size={16} className="text-gray-400" />
                        <span>{orgData.contactPhone}</span>
                      </div>
                    )}
                    {orgData.website && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 col-span-1 sm:col-span-2">
                        <Globe size={16} className="text-gray-400" />
                        <a
                          href={orgData.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline truncate"
                        >
                          {orgData.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Access URL Section */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  {/* <Link size={18} className="text-green-600" /> */}
                  <h4 className="text-base font-normal uppercase tracking-normal text-[#475569]">
                    Access Link Details
                  </h4>
                </div>
                <div className="rounded-xl bg-white  border border-gray-100 shadow-sm p-4 group relative">
                  <p className="text-sm text-blue-600 hover:underline truncate break-all leading-relaxed">
                    {orgData.accessUrl.replace(/^https:\/\//, "") ||
                      "No access link generated"}
                  </p>
                  {orgData.accessUrl && (
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(orgData.accessUrl);
                        toast.success("Link copied to clipboard");
                      }}
                      className="mt-3 text-xs font-bold text-green-700 hover:text-green-900 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      Copy Link
                    </button>
                  )}
                </div>
              </section>

              {/* Stripe Onboarding URL Section */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  {/* <ExternalLink size={18} className="text-blue-600" /> */}
                  <h4 className="text-base font-normal uppercase tracking-normal text-[#475569]">
                    Stripe Onboarding
                  </h4>
                </div>
                <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-4">
                  {orgData.onBoardingLink ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 text-xs font-bold rounded-full ${
                            orgData.stripeOnboardingCompleted
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {orgData.stripeOnboardingCompleted
                            ? "Completed"
                            : "Pending"}
                        </span>
                        <span className="text-xs text-gray-500">
                          Charges:{" "}
                          {orgData.stripeChargesEnabled
                            ? "Enabled"
                            : "Disabled"}{" "}
                          • Payouts:{" "}
                          {orgData.stripePayoutsEnabled
                            ? "Enabled"
                            : "Disabled"}
                        </span>
                      </div>

                      <div className="bg-white rounded-lg p-3 border border-blue-100">
                        <p className="text-xs font-medium text-gray-500 mb-1">
                          Onboarding URL
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-blue-600 break-all flex-1">
                            {orgData.onBoardingLink}
                          </p>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(
                                orgData.onBoardingLink,
                              );
                              toast.success(
                                "Onboarding link copied to clipboard",
                              );
                            }}
                            className="shrink-0 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Copy link"
                          >
                            <Link size={16} className="text-blue-600" />
                          </button>
                          <a
                            href={orgData.onBoardingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Open in new tab"
                          >
                            <ExternalLink size={16} className="text-blue-600" />
                          </a>
                        </div>
                      </div>

                      {/* {!orgData.stripeOnboardingCompleted && (
                        <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg">
                          ⚠️ Complete Stripe onboarding to enable payouts
                        </p>
                      )} */}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      No Stripe onboarding link available
                    </p>
                  )}
                </div>
              </section>

              {/* Stats Grid */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  {/* <BarChart3 size={18} className="text-blue-600" /> */}
                  <h4 className="text-base font-normal uppercase tracking-normal text-[#475569]">
                    Performance & Earnings
                  </h4>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center group">
                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-1 group-hover:text-blue-500 transition-colors">
                      Total Clicks
                    </p>
                    <p className="text-xl font-black text-gray-800">
                      {orgData.totalClicks}
                    </p>
                  </div>
                  <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center group">
                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-1 group-hover:text-blue-500 transition-colors">
                      Total Subscribers
                    </p>
                    <p className="text-xl font-black text-gray-800">
                      {orgData.uniqueVisitors}
                    </p>
                  </div>
                  <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center group">
                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-1 group-hover:text-green-500 transition-colors flex items-center justify-center gap-1">
                      Rate <Percent size={10} />
                    </p>
                    <p className="text-xl font-black text-gray-800">
                      {orgData.commissionRatePercent}%
                    </p>
                  </div>
                  <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center group border-l-4 border-l-green-500">
                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-1 group-hover:text-green-500 transition-colors flex items-center justify-center gap-1">
                      Balance <Wallet size={10} />
                    </p>
                    <p className="text-xl font-black text-green-600">
                      ${parseFloat(orgData?.commissionBalance || 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              </section>

              {/* Referred Users Table */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* <Users size={18} className="text-indigo-600" /> */}
                    <h4 className="text-base font-normal uppercase tracking-normal text-[#475569]">
                      Referred Users
                    </h4>
                  </div>
                  {/* <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[11px] font-bold rounded-full">
                    {detailedData?.data?.referredUsers?.length || 0} Total
                  </span> */}
                </div>

                <div className="overflow-hidden border border-gray-100 rounded-xl bg-white">
                  {isLoadingDetails ? (
                    <div className="py-12 flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-gray-300" />
                      <p className="text-[10px] font-bold text-gray-400 uppercase">
                        Loading users...
                      </p>
                    </div>
                  ) : (
                    <table className="w-full text-left">
                      <thead className="bg-[#EFEEEE] border-b border-gray-100">
                        <tr>
                          <th className="px-4 py-3 text-[10px] font-bold uppercase text-gray-400 tracking-widest">
                            Athlete
                          </th>
                          <th className="px-4 py-3 text-[10px] font-bold uppercase text-gray-400 tracking-widest">
                            Location
                          </th>
                          <th className="px-4 py-3 text-[10px] font-bold uppercase text-gray-400 tracking-widest">
                            Status
                          </th>
                          <th className="px-4 py-3 text-[10px] font-bold uppercase text-gray-400 tracking-widest text-right">
                            Joined
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {detailedData?.data?.referredUsers &&
                        detailedData.data.referredUsers.length > 0 ? (
                          detailedData.data.referredUsers.map((user) => (
                            <tr
                              key={user.id}
                              className="hover:bg-gray-50/50 transition-colors"
                            >
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0 overflow-hidden border border-gray-100">
                                    {user.imgUrl ? (
                                      <img
                                        src={user.imgUrl}
                                        alt={user.athleteFullName}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-400 uppercase">
                                        {user.athleteFullName.charAt(0)}
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-gray-800 leading-tight">
                                      {user.athleteFullName}
                                    </p>
                                    <p className="text-[11px] text-gray-400">
                                      {user.email}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <p className="text-xs text-gray-600">
                                  {user.city}, {user.state}
                                </p>
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={`px-2 py-0.5 text-[9px] font-black rounded-lg uppercase tracking-tight ${
                                    user.subscribeStatus === "PRO"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-gray-100 text-gray-600"
                                  }`}
                                >
                                  {user.subscribeStatus}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <p className="text-[11px] font-medium text-gray-500">
                                  {format(
                                    new Date(user.createdAt),
                                    "MMM d, yyyy",
                                  )}
                                </p>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="px-4 py-12 text-center">
                              <Users className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                              <p className="text-xs text-gray-400 font-medium">
                                No referred users found yet.
                              </p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              </section>

              {/* Activity Info */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6 border-b border-gray-100">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar size={14} />
                    <span className="text-[10px] uppercase font-bold">
                      Created At
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {orgData.createdAt
                      ? format(new Date(orgData.createdAt), "PPP")
                      : "N/A"}
                  </span>
                </div>
                <div className="flex flex-col gap-1 md:items-end">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar size={14} />
                    <span className="text-[10px] uppercase font-bold">
                      Last Accessed
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {orgData.lastAccessed
                      ? format(new Date(orgData.lastAccessed), "PPP p")
                      : "Never"}
                  </span>
                </div>
              </section>
            </>
          )}
        </div>

        {/* Footer (Sticky Buttons) */}
        <div
          className="sticky bottom-0 z-10 bg-white px-6 py-5
                    border-t border-gray-100 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => {
                if (isEditing) {
                  setIsEditing(false);
                  setImagePreview(orgData.imaageUrl);
                } else {
                  onClose?.();
                }
              }}
              className="flex-1 rounded-xl border-2 border-gray-100 px-4 py-3 font-bold text-gray-400
                     hover:bg-gray-50 transition-all cursor-pointer text-sm"
            >
              {isEditing ? "Cancel Edit" : "Close Overview"}
            </button>

            <button
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              disabled={isUpdating}
              className="flex-1 rounded-xl bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)]
                     px-4 py-3 font-bold text-white
                     shadow-lg shadow-green-100 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer text-sm flex items-center justify-center gap-2"
            >
              {isUpdating && <Loader2 className="animate-spin" size={18} />}
              {isEditing
                ? isUpdating
                  ? "Saving..."
                  : "Save Changes"
                : "Modify Details"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
