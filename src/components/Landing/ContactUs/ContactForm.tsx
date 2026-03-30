import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MdVerified, MdSend } from "react-icons/md";
import { useSendContactMessageMutation } from "@/redux/features/contact/contactApi";
import { toast } from "sonner";

// ─── Zod Schema ──────────────────────────────────────────────────────────────

const contactSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be under 50 characters"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be under 50 characters"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z
    .string()
    .min(7, "Please enter a valid phone number")
    .max(20, "Phone number is too long"),
  role: z.string().min(1, "Please select your role"),
  subject: z.string().min(2, "Subject must be at least 2 characters"),
  message: z
    .string()
    .min(20, "Message must be at least 20 characters")
    .max(1000, "Message must be under 1000 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

// ─── Field Error ─────────────────────────────────────────────────────────────

const FieldError = ({ message }: { message?: string }) =>
  message ? (
    <p className="text-red-500 text-xs font-medium mt-1 flex items-center gap-1">
      <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
      {message}
    </p>
  ) : null;

// ─── Component ───────────────────────────────────────────────────────────────

const ContactForm: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
  });

  const [sendContactMessage, { isLoading: isSending }] =
    useSendContactMessageMutation();

  const messageValue = watch("message") ?? "";

  const onSubmit = async (data: ContactFormData) => {
    try {
      await sendContactMessage({
        ...data,
        role: data.role.toUpperCase(),
      }).unwrap();
      setIsSubmitted(true);
      toast.success("Message sent successfully!");
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Failed to send message. Please try again.",
      );
    }
  };

  const roleOptions = [
    { value: "parent", label: "Parent" },
    { value: "athlete", label: "Athlete" },
    { value: "coach", label: "Coach / Recruiter" },
    { value: "other", label: "Other" },
  ];

  const inputBase =
    "w-full px-4 py-3.5 rounded-xl border bg-white text-[#1A202C] placeholder-[#A0ADB8] font-medium text-sm focus:outline-none focus:ring-2 transition-all duration-200";

  const inputClass = (hasError: boolean) =>
    `${inputBase} ${
      hasError
        ? "border-red-400 focus:ring-red-200 focus:border-red-400"
        : "border-gray-200 focus:ring-[#11D000]/40 focus:border-[#11D000]"
    }`;

  // ── Success State ─────────────────────────────────────────────────────────
  if (isSubmitted) {
    return (
      <div className="bg-[#F4FAF6] rounded-3xl p-10 md:p-16 flex flex-col items-center text-center shadow-sm border border-emerald-50">
        <div className="w-20 h-20 rounded-full bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] flex items-center justify-center text-white mb-6 shadow-lg">
          <MdVerified size={40} />
        </div>
        <h3 className="text-2xl md:text-3xl font-bold text-[#1A202C] mb-3">
          Message Sent!
        </h3>
        <p className="text-[#6C7787] text-base max-w-md mb-8">
          Thank you for reaching out. Our team will review your message and get
          back to you within 24 hours.
        </p>
        <button
          onClick={() => {
            setIsSubmitted(false);
            reset();
          }}
          className="py-3 px-8 rounded-full border border-[#0C5302] text-[#0C5302] font-semibold text-sm hover:bg-[#F4FAF6] transition-colors duration-200 cursor-pointer"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────────
  return (
    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_4px_40px_rgba(17,208,0,0.08)] border border-emerald-50">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1A202C] mb-2">
          Send Us a Message
        </h2>
        <p className="text-[#6C7787] text-sm font-medium">
          Fill out the form below and we'll get back to you promptly.
        </p>
      </div>

      <form
        id="contact-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
        noValidate
      >
        {/* ── Name Row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="firstName"
              className="text-xs font-bold text-[#323C4B] uppercase tracking-wide"
            >
              First Name <span className="text-[#11D000]">*</span>
            </label>
            <input
              id="firstName"
              type="text"
              placeholder="e.g. Marcus"
              className={inputClass(!!errors.firstName)}
              {...register("firstName")}
            />
            <FieldError message={errors.firstName?.message} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="lastName"
              className="text-xs font-bold text-[#323C4B] uppercase tracking-wide"
            >
              Last Name <span className="text-[#11D000]">*</span>
            </label>
            <input
              id="lastName"
              type="text"
              placeholder="e.g. Johnson"
              className={inputClass(!!errors.lastName)}
              {...register("lastName")}
            />
            <FieldError message={errors.lastName?.message} />
          </div>
        </div>

        {/* ── Email & Phone Row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="contact-email"
              className="text-xs font-bold text-[#323C4B] uppercase tracking-wide"
            >
              Email Address <span className="text-[#11D000]">*</span>
            </label>
            <input
              id="contact-email"
              type="email"
              placeholder="you@example.com"
              className={inputClass(!!errors.email)}
              {...register("email")}
            />
            <FieldError message={errors.email?.message} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="phoneNumber"
              className="text-xs font-bold text-[#323C4B] uppercase tracking-wide"
            >
              Phone Number <span className="text-[#11D000]">*</span>
            </label>
            <input
              id="phoneNumber"
              type="tel"
              placeholder="+1 (555) 000-0000"
              className={inputClass(!!errors.phoneNumber)}
              {...register("phoneNumber")}
            />
            <FieldError message={errors.phoneNumber?.message} />
          </div>
        </div>

        {/* ── Role & Subject Row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="role"
              className="text-xs font-bold text-[#323C4B] uppercase tracking-wide"
            >
              I Am A <span className="text-[#11D000]">*</span>
            </label>
            <select
              id="role"
              className={`${inputClass(!!errors.role)} cursor-pointer appearance-none`}
              {...register("role")}
              defaultValue=""
            >
              <option value="" disabled>
                Select your role
              </option>
              {roleOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <FieldError message={errors.role?.message} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="subject"
              className="text-xs font-bold text-[#323C4B] uppercase tracking-wide"
            >
              Subject <span className="text-[#11D000]">*</span>
            </label>
            <input
              id="subject"
              type="text"
              placeholder="How can we help?"
              className={inputClass(!!errors.subject)}
              {...register("subject")}
            />
            <FieldError message={errors.subject?.message} />
          </div>
        </div>

        {/* ── Message ── */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="message"
              className="text-xs font-bold text-[#323C4B] uppercase tracking-wide"
            >
              Message <span className="text-[#11D000]">*</span>
            </label>
            <span
              className={`text-xs font-medium ${
                messageValue.length > 1000
                  ? "text-red-500"
                  : messageValue.length >= 20
                    ? "text-[#11D000]"
                    : "text-[#A0ADB8]"
              }`}
            >
              {messageValue.length} / 1000
            </span>
          </div>
          <textarea
            id="message"
            rows={5}
            placeholder="Tell us how we can help you..."
            className={`${inputClass(!!errors.message)} resize-none`}
            {...register("message")}
          />
          <FieldError message={errors.message?.message} />
        </div>

        {/* ── Submit Button ── */}
        <button
          type="submit"
          id="contact-submit-btn"
          disabled={isSending}
          className="w-full py-4 px-8 rounded-full bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] text-white font-bold text-base shadow-md hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 active:translate-y-0 active:shadow-md transition-all duration-300 ease-out disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSending ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Sending...
            </>
          ) : (
            <>
              <MdSend size={20} />
              Send Message
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
