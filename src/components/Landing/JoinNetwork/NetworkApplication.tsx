import React from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useSendOrganizationNameMutation } from "@/redux/features/roadmap/roadmapApi";

const formSchema = z.object({
  organizationName: z
    .string()
    .min(2, "Organization name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address").transform((val) => val.toLowerCase()),
});

type FormValues = z.infer<typeof formSchema>;

const NetworkApplication: React.FC = () => {
  const [sendOrganizationName] = useSendOrganizationNameMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organizationName: "",
      email: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await sendOrganizationName({
        organizationName: data.organizationName,
        Organizationemail: data.email,
      }).unwrap();
      toast.success("Application submitted successfully!");
      reset();
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
        "Failed to submit application. Please try again.",
      );
    }
  };

  return (
    <section className="py-16 md:py-24 px-6 bg-white">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Left Side: Who is this for? */}
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#181D27] mb-8">
            Who is this for?
          </h2>
          <ul className="space-y-6">
            {[
              "Club Directors & Coaches",
              "School Athletic Departments",
              "Tournament Organizers",
            ].map((text) => (
              <li key={text} className="flex group items-center gap-4">
                <div className="shrink-0 w-6 h-6 rounded-full bg-[#079455] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                </div>
                <span className="text-lg font-medium text-[#475467]">
                  {text}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Side: Form Card */}
        <div className="bg-[#EBF7EF] p-8 md:p-12 rounded-3xl md:rounded-[2.5rem] border border-emerald-50 w-full">
          <h3 className="text-2xl md:text-3xl font-semibold text-[#181D27] mb-4">
            Ready to get started?
          </h3>
          <p className="text-[#475467] text-sm mb-8 leading-relaxed">
            Our network program is currently by application only. We are looking
            for members who share our commitment to athlete development and
            transparency.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <input
                {...register("organizationName")}
                type="text"
                placeholder="Organization Name"
                className={`w-full px-6 py-4 rounded-full bg-white border ${errors.organizationName ? "border-red-500" : "border-gray-100"
                  } focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm shadow-md`}
              />
              {errors.organizationName && (
                <p className="text-red-500 text-xs ml-4 font-medium italic">
                  {errors.organizationName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <input
                {...register("email")}
                type="email"
                placeholder="Contact Email"
                className={`w-full px-6 py-4 rounded-full bg-white border ${errors.email ? "border-red-500" : "border-gray-100"
                  } focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm shadow-md`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs ml-4 font-medium italic">
                  {errors.email.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] text-white px-6 sm:px-10 py-6 w-full md:w-fit mx-auto rounded-full text-sm sm:text-base font-semibold hover:brightness-110 transition-all shadow-lg cursor-pointer border-none uppercase md:tracking-wider disabled:opacity-70"
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default NetworkApplication;
