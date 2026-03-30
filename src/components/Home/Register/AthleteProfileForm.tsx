import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Upload, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { LuPencilLine } from "react-icons/lu";

const athleteProfileSchema = z.object({
  age: z.string().min(1, "Age is required"),
  height: z.string().min(1, "Height is required"),
  weight: z
    .string()
    .min(1, "Weight is required")
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    }, "Please enter a valid weight"),
  sport: z.string().min(1, "Sports is required"),
  gradYear: z
    .string()
    .min(1, "Grad Year is required")
    .refine((val) => {
      const year = parseInt(val);
      return !isNaN(year) && year >= 2000;
    }, "Grad Year must be 2000 or later"),
  primaryPosition: z.string().min(1, "Primary Position is required"),
  dominateHand: z.string().min(1, "Dominate Hand is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  highSchool: z.string().min(1, "High School/Middle School is required"),
  aauClub: z.string().min(1, "AAU Club Team is required"),
  jerseyNumber: z
    .string()
    .min(1, "Jersey Number is required")
    .refine((val) => {
      const num = parseInt(val);
      return !isNaN(num) && num >= 0 && num <= 999;
    }, "Please enter a valid jersey number (0-999)"),
  gpa: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      const gpaNum = parseFloat(val);
      if (isNaN(gpaNum) || gpaNum < 0 || gpaNum > 4) return false;
      return /^\d+(\.\d{1,2})?$/.test(val);
    }, "GPA must be between 0 and 4 with up to 2 decimal places"),
  agreedToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the Terms of Service",
  }),
  bio: z
    .string()
    .min(1, "Bio is required")
    .max(100, "Bio must be at most 100 characters"),
});

type AthleteProfileFormValues = z.infer<typeof athleteProfileSchema>;

interface AthleteProfileFormProps {
  data: AthleteProfileData;
  role: string;
  onBack: () => void;
  onSubmit: (data: AthleteProfileData) => void;
  isLoading?: boolean;
}

export interface AthleteProfileData {
  profileImage?: File;
  age: string;
  height: string;
  weight: string;
  sport: string;
  gradYear: string;
  primaryPosition: string;
  dominateHand: string;
  city: string;
  state: string;
  highSchool: string;
  aauClub: string;
  jerseyNumber: string;
  gpa?: string;
  agreedToTerms: boolean;
  bio?: string;
}

const heightOptions = Array.from({ length: 37 }, (_, i) => {
  const totalInches = 49 + i; // Start from 4'1" (49 inches) up to 7'1" (85 inches)
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  return `${feet}'${inches}`;
});

const sportOptions = ["Boys Basketball", "Girls Basketball"];

const positionOptions: Record<string, string[]> = {
  Basketball: [
    "Point Guard",
    "Shooting Guard",
    "Small Forward",
    "Power Forward",
    "Center",
  ],
  "Boys Basketball": [
    "Point Guard",
    "Shooting Guard",
    "Small Forward",
    "Power Forward",
    "Center",
  ],
  "Girls Basketball": [
    "Point Guard",
    "Shooting Guard",
    "Small Forward",
    "Power Forward",
    "Center",
  ],
};

const handOptions = ["Right", "Left"];

const usStates = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

export default function AthleteProfileForm({
  data,
  role,
  onBack,
  onSubmit,
  isLoading = false,
}: AthleteProfileFormProps) {
  const [profileImage, setProfileImage] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string>("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AthleteProfileFormValues>({
    resolver: zodResolver(athleteProfileSchema),
    defaultValues: {
      ...data,
      sport: data.sport || "Basketball",
    },
  });

  useEffect(() => {
    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        setValue(key as keyof AthleteProfileFormValues, value as any);
      });
    }
  }, [data, setValue]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmitForm = (formData: AthleteProfileFormValues) => {
    console.log("fhdf", formData);
    onSubmit({
      ...formData,
      profileImage: profileImage || undefined,
    });
  };

  return (
    <div className="w-full max-w-xl mx-auto px-6 py-8">
      {/* Back Button */}
      <button
        type="button"
        onClick={onBack}
        className="text-green-600 hover:text-green-700 font-medium flex items-center gap-2 cursor-pointer"
        disabled={isLoading}
      >
        <ArrowLeft size={18} />
        Back
      </button>

      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-medium text-gray-800 mb-2">
          Create account
        </h1>
        <p className="text-gray-600">Enter your athletic profile information</p>
      </div>

      {/* Profile Picture Upload */}
      <div className="mb-8 flex justify-start items-center gap-4">
        <div className="relative shrink-0">
          <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
            {previewUrl ? (
              <img
                src={previewUrl || "/placeholder.svg"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-gray-400 text-4xl">👤</div>
            )}
          </div>
          {/* Edit Icon */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 p-1 border-2 border-white bg-green-600 text-center font-semibold hover:bg-green-700 disabled:bg-green-700 text-white rounded-full bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] shadow-md transition-all duration-300 ease-out cursor-pointer"
            type="button"
            disabled={isLoading}
          >
            <LuPencilLine size={12} />
          </button>
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-center font-semibold hover:bg-green-700 disabled:bg-green-700 text-white rounded-lg bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 active:translate-y-0 active:shadow-md focus:outline-none cursor-pointer"
          disabled={isLoading}
        >
          <Upload size={16} />
          Upload
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          aria-label="Upload profile picture"
          disabled={isLoading}
        />
      </div>

      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
        {/* Age - Full Width since Graduation Class is removed */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Age <span className="text-black text-md">*</span>
          </label>
          <input
            type="number"
            {...register("age")}
            placeholder="18"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              errors.age ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isLoading}
          />
          {errors.age && (
            <p className="text-red-500 text-xs mt-1">{errors.age.message}</p>
          )}
        </div>

        {/* Height & Weight */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Height <span className="text-black text-md">*</span>
            </label>
            <select
              {...register("height")}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white ${
                errors.height ? "border-red-500" : "border-gray-300"
              }`}
              disabled={isLoading}
            >
              <option value="">Select Height</option>
              {heightOptions.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
            {errors.height && (
              <p className="text-red-500 text-xs mt-1">
                {errors.height.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Weight (lbs) <span className="text-black text-md">*</span>
            </label>
            <input
              type="number"
              {...register("weight")}
              placeholder="e.g. 180"
              min={1}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.weight ? "border-red-500" : "border-gray-300"
              }`}
              disabled={isLoading}
            />
            {errors.weight && (
              <p className="text-red-500 text-xs mt-1">
                {errors.weight.message}
              </p>
            )}
          </div>
        </div>

        {/* Sport & Grad Year */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Sports <span className="text-black text-md">*</span>
            </label>
            <select
              {...register("sport")}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white ${
                errors.sport ? "border-red-500" : "border-gray-300"
              }`}
              disabled={isLoading}
            >
              <option value="">Select Sports</option>
              {sportOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {errors.sport && (
              <p className="text-red-500 text-xs mt-1">
                {errors.sport.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Grad year <span className="text-black text-md">*</span>
            </label>
            <select
              {...register("gradYear")}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white ${
                errors.gradYear ? "border-red-500" : "border-gray-300"
              }`}
              disabled={isLoading}
            >
              <option value="">Select Grad Year</option>
              {role === "ATHLATE"
                ? // For 18+ Athletes: 2000 to 2025
                  Array.from({ length: 26 }, (_, i) => 2025 - i).map((year) => (
                    <option key={year} value={year.toString()}>
                      {year}
                    </option>
                  ))
                : // For Minors (via Parents): 2025 to 2032
                  Array.from(
                    { length: 7 },
                    (_, i) => new Date().getFullYear() + i,
                  ).map((year) => (
                    <option key={year} value={year.toString()}>
                      {year}
                    </option>
                  ))}
            </select>
            {errors.gradYear && (
              <p className="text-red-500 text-xs mt-1">
                {errors.gradYear.message}
              </p>
            )}
          </div>
        </div>

        {/* Primary Position */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Primary Position <span className="text-black text-md">*</span>
          </label>
          <select
            {...register("primaryPosition")}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white ${
              errors.primaryPosition ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isLoading}
          >
            <option value="">Select Position</option>
            {(
              positionOptions[watch("sport")] || positionOptions["Basketball"]
            ).map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          {errors.primaryPosition && (
            <p className="text-red-500 text-xs mt-1">
              {errors.primaryPosition.message}
            </p>
          )}
        </div>

        {/* Dominate Hand - Full Width */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Dominate Hand <span className="text-black text-md">*</span>
          </label>
          <select
            {...register("dominateHand")}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white ${
              errors.dominateHand ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isLoading}
          >
            <option value="">Select Hand</option>
            {handOptions.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
          {errors.dominateHand && (
            <p className="text-red-500 text-xs mt-1">
              {errors.dominateHand.message}
            </p>
          )}
        </div>

        {/* City & State */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              City <span className="text-black text-md">*</span>
            </label>
            <input
              type="text"
              {...register("city")}
              placeholder="e.g. New York"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.city ? "border-red-500" : "border-gray-300"
              }`}
              disabled={isLoading}
            />
            {errors.city && (
              <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              State <span className="text-black text-md">*</span>
            </label>
            <select
              {...register("state")}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white ${
                errors.state ? "border-red-500" : "border-gray-300"
              }`}
              disabled={isLoading}
            >
              <option value="">Select State</option>
              {usStates.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {errors.state && (
              <p className="text-red-500 text-xs mt-1">
                {errors.state.message}
              </p>
            )}
          </div>
        </div>

        {/* High School/Middle School - Full Width */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            High School/Middle School{" "}
            <span className="text-black text-md">*</span>
          </label>
          <input
            type="text"
            {...register("highSchool")}
            placeholder="Enter your school name"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              errors.highSchool ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isLoading}
          />
          {errors.highSchool && (
            <p className="text-red-500 text-xs mt-1">
              {errors.highSchool.message}
            </p>
          )}
        </div>

        {/* AAU Club Team & Jersey Number */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              AAU Club Team <span className="text-black text-md">*</span>
            </label>
            <input
              type="text"
              {...register("aauClub")}
              placeholder="Enter team name"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.aauClub ? "border-red-500" : "border-gray-300"
              }`}
              disabled={isLoading}
            />
            {errors.aauClub && (
              <p className="text-red-500 text-xs mt-1">
                {errors.aauClub.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Jersey Number <span className="text-black text-md">*</span>
            </label>
            <input
              type="number"
              {...register("jerseyNumber")}
              placeholder="e.g. 23"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.jerseyNumber ? "border-red-500" : "border-gray-300"
              }`}
              disabled={isLoading}
            />
            {errors.jerseyNumber && (
              <p className="text-red-500 text-xs mt-1">
                {errors.jerseyNumber.message}
              </p>
            )}
          </div>
        </div>

        {/* Bio - Full Width */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-900">
              Bio <span className="text-black text-md">*</span>
            </label>
            <span
              className={`text-[10px] font-medium ${watch("bio")?.length >= 100 ? "text-red-500" : "text-gray-400"}`}
            >
              {watch("bio")?.length || 0}/100
            </span>
          </div>
          <textarea
            {...register("bio")}
            placeholder="Tell us about yourself (max 100 characters)..."
            maxLength={100}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent min-h-[100px] ${
              errors.bio ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isLoading}
          />
          {errors.bio && (
            <p className="text-red-500 text-xs mt-1">{errors.bio.message}</p>
          )}
        </div>

        {/* GPA Optional - Full Width */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            GPA (optional)
          </label>
          <input
            type="number"
            {...register("gpa")}
            placeholder="e.g. 3.8"
            min={0}
            max={4}
            step={0.01}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              errors.gpa ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isLoading}
          />
          {errors.gpa && (
            <p className="text-red-500 text-xs mt-1">{errors.gpa.message}</p>
          )}
        </div>

        {/* Terms Checkbox */}
        <div className="flex flex-col gap-1">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="terms"
              {...register("agreedToTerms")}
              className="w-5 h-5 cursor-pointer accent-green-600"
              disabled={isLoading}
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              I agree to{" "}
              <a
                href="#"
                className="font-semibold text-green-600 hover:underline"
              >
                Terms of Service
              </a>
              ,{" "}
              <a
                href="#"
                className="font-semibold text-green-600 hover:underline"
              >
                Privacy Policy
              </a>
              ,{" "}
              <a
                href="#"
                className="font-semibold text-green-600 hover:underline"
              >
                COPPA Compliance Notice
              </a>
              ,{" "}
              <a
                href="#"
                className="font-semibold text-green-600 hover:underline"
              >
                Consent & Media Release
              </a>
            </label>
          </div>
          {errors.agreedToTerms && (
            <p className="text-red-500 text-xs mt-1">
              {errors.agreedToTerms.message}
            </p>
          )}
        </div>

        {/* Register Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-green-600 text-center font-semibold hover:bg-green-700 disabled:bg-green-700 text-white rounded-lg bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 active:translate-y-0 active:shadow-md focus:outline-none cursor-pointer disabled:cursor-not-allowed"
        >
          {isLoading ? "Registering..." : "Register"}
        </button>

        {/* Login Link */}
        <div className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-green-600 hover:underline"
          >
            Log In Now
          </Link>
        </div>
      </form>
    </div>
  );
}
