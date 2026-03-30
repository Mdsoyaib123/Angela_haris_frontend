import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Mail } from "lucide-react";
import { Step1Data } from "@/pages/Signup";
import { Link } from "react-router-dom";
import {
  PASSWORD_REGEX,
  PASSWORD_VALIDATION_MESSAGE,
} from "@/utils/passwordValidation";

type Role = "athlete" | "parent";

const buildSchema = (role: Role) =>
  z
    .object({
      athleteFullName: z.string().min(1, "Athlete Full Name is required"),
      athleteEmail:
        role === "athlete"
          ? z.string().email("Please enter a valid athlete email")
          : z.string().optional(),
      athleteDateOfBirth: z
        .string()
        .min(1, "Athlete Date of Birth is required"),
      parentFullName:
        role === "parent"
          ? z.string().min(1, "Parent Full Name is required")
          : z.string().optional(),
      parentEmail:
        role === "parent"
          ? z.string().email("Please enter a valid parent email")
          : z.string().optional(),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .regex(PASSWORD_REGEX, PASSWORD_VALIDATION_MESSAGE),
      confirmPassword: z.string().min(1, "Please confirm your password"),
      phoneNumber: z
        .string()
        .min(10, "Phone number must be at least 10 digits")
        .max(10, "Phone number cannot exceed 10 digits")
        .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
      referredBy: z.string().optional(),
      role: z.string().optional(),
    })
    .refine(
      (data) => {
        if (!data.athleteDateOfBirth) return true;
        const birthDate = new Date(data.athleteDateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        if (role === "athlete") {
          return age >= 18;
        } else {
          return age >= 12 && age <= 18;
        }
      },
      {
        message:
          role === "athlete"
            ? "Athlete must be at least 18 years old"
            : "Athlete must be between 12 and 18 years old",
        path: ["athleteDateOfBirth"],
      },
    )
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

type Step1FormValues = z.infer<ReturnType<typeof buildSchema>>;

interface CreateAccountFormProps {
  initialData?: Step1Data;
  onNext?: (formData: Step1Data) => void;
}

export default function CreateAccountForm({
  initialData,
  onNext,
}: CreateAccountFormProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [role, setRole] = useState<Role>(
    initialData?.role?.toUpperCase() === "ATHLATE" ? "athlete" : "parent",
  );

  const schema = buildSchema(role);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<Step1FormValues>({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      athleteFullName: "",
      athleteEmail: "",
      athleteDateOfBirth: "",
      parentFullName: "",
      parentEmail: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      referredBy: "",
      role: "PARENT",
    },
  });

  /* Re-validate when role changes */
  useEffect(() => {
    reset(undefined, { keepValues: true });
  }, [role, reset]);

  useEffect(() => {
    if (initialData) {
      if (initialData.role) {
        setRole(
          initialData.role.toUpperCase() === "ATHLATE" ? "athlete" : "parent",
        );
      }
      Object.entries(initialData).forEach(([key, value]) => {
        setValue(key as keyof Step1FormValues, value as any);
      });
    }
  }, [initialData, setValue]);

  const onSubmitForm = (data: Step1FormValues) => {
    if (onNext) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...rest } = data;
      const finalData: Step1Data = {
        ...rest,
        athleteEmail: rest.athleteEmail ?? "",
        role: role === "athlete" ? "ATHLATE" : "PARENT",
      } as Step1Data;

      // Automatically sync parent email for 18+ athletes
      if (role === "athlete") {
        finalData.parentEmail = rest.athleteEmail ?? "";
      }

      onNext(finalData);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8 max-w-xl w-full">
      <div className="w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create account
          </h1>
          <p className="text-gray-600 text-sm">
            Enter your details to create your account
          </p>
        </div>

        {/* ── Role toggle ── */}
        <div className="flex mb-6 rounded-xl border border-gray-200 overflow-hidden">
          <button
            type="button"
            onClick={() => setRole("athlete")}
            className={`flex-1 py-2.5 text-sm font-semibold transition-colors cursor-pointer ${
              role === "athlete"
                ? "bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] text-white"
                : "bg-white text-gray-500 hover:bg-gray-50"
            }`}
          >
            Athlete (18+)
          </button>
          <button
            type="button"
            onClick={() => setRole("parent")}
            className={`flex-1 py-2.5 text-sm font-semibold transition-colors cursor-pointer ${
              role === "parent"
                ? "bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] text-white"
                : "bg-white text-gray-500 hover:bg-gray-50"
            }`}
          >
            Parent
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-5">
          {/* Athlete Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Athlete Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("athleteFullName")}
              placeholder="e.g. Ahmad"
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-400 ${
                errors.athleteFullName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.athleteFullName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.athleteFullName.message}
              </p>
            )}
          </div>

          {/* Athlete Email — hidden for Parent */}
          {role === "athlete" && (
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Athlete Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="email"
                  {...register("athleteEmail")}
                  placeholder="Enter athlete email"
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-400 ${
                    errors.athleteEmail ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              {errors.athleteEmail && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.athleteEmail.message}
                </p>
              )}
            </div>
          )}

          {/* Athlete Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Athlete Date Of Birth <span className="text-red-500">*</span>
            </label>
            <input
              min={
                role === "parent"
                  ? `${new Date().getFullYear() - 18}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(new Date().getDate()).padStart(2, "0")}`
                  : undefined
              }
              max={
                role === "athlete"
                  ? `${new Date().getFullYear() - 18}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(new Date().getDate()).padStart(2, "0")}`
                  : `${new Date().getFullYear() - 12}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(new Date().getDate()).padStart(2, "0")}`
              }
              type="date"
              {...register("athleteDateOfBirth")}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-400 ${
                errors.athleteDateOfBirth ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.athleteDateOfBirth && (
              <p className="text-red-500 text-xs mt-1">
                {errors.athleteDateOfBirth.message}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">Select from calendar</p>
          </div>

          {/* Parent Full Name - hidden for Athlete */}
          {role === "parent" && (
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Parent Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("parentFullName")}
                placeholder="Enter your parent name"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-400 ${
                  errors.parentFullName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.parentFullName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.parentFullName.message}
                </p>
              )}
            </div>
          )}

          {/* Parent Email - hidden for Athlete */}
          {role === "parent" && (
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Your Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="email"
                  {...register("parentEmail")}
                  placeholder="Enter your email"
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-400 ${
                    errors.parentEmail ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              {errors.parentEmail && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.parentEmail.message}
                </p>
              )}
            </div>
          )}

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              {...register("phoneNumber")}
              placeholder="e.g. 1234567890"
              maxLength={10}
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-400 ${
                errors.phoneNumber ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-xs mt-1">
                {errors.phoneNumber.message}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              10-digit phone number without spaces or dashes
            </p>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Enter your password"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-400 pr-10 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Password Requirements Hint */}
            <div className="mt-2 space-y-1">
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Password Requirements:
              </p>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                {[
                  {
                    label: "8+ characters",
                    met: watch("password")?.length >= 8,
                  },
                  {
                    label: "Uppercase letter",
                    met: /[A-Z]/.test(watch("password") || ""),
                  },
                  {
                    label: "Lowercase letter",
                    met: /[a-z]/.test(watch("password") || ""),
                  },
                  { label: "Number", met: /\d/.test(watch("password") || "") },
                  {
                    label: "Special character",
                    met: /[@$!%*?&]/.test(watch("password") || ""),
                  },
                ].map((req, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div
                      className={`w-1 h-1 rounded-full ${req.met ? "bg-green-500" : "bg-gray-300"}`}
                    />
                    <span
                      className={`text-[10px] ${req.met ? "text-green-600 font-medium" : "text-gray-400"}`}
                    >
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                placeholder="Confirm your password"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-400 pr-10 ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Referred By
            </label>
            <input
              type="text"
              {...register("referredBy")}
              disabled
              placeholder="Enter referral code"
              className="w-full px-4 py-2.5 disabled:bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            />
          </div>

          {/* Next Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 mt-6 bg-green-600 text-center font-semibold hover:bg-green-700 text-white rounded-lg bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 active:translate-y-0 active:shadow-md focus:outline-none cursor-pointer"
          >
            Next
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
    </div>
  );
}
