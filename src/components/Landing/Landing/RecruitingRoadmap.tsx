import React from "react";
import { Check } from "lucide-react";
import RecruitingRoadmapPhoto from "@/assets/angelaharris/RecruitingRoadmapPhoto.jpg";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import { useSendRoadmapMutation } from "@/redux/features/roadmap/roadmapApi";

const formSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .transform((val) => val.toLowerCase()),
});

type FormValues = z.infer<typeof formSchema>;

const RecruitingRoadmap: React.FC = () => {
  const [sendRoadmap] = useSendRoadmapMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const checklist = ["Start Early", "Stay Organized", "Be Proactive"];

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await sendRoadmap(data).unwrap();
      if (response.success) {
        toast.success(
          response.message || "Roadmap sent! Please check your email.",
        );
        reset();
      } else {
        toast.error(response.message || "Failed to send roadmap.");
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Something went wrong. Please try again.",
      );
    }
  };

  return (
    <section className="bg-white flex items-stretch">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2">
        {/* Left Content Column */}
        <div className="flex flex-col justify-center px-8 py-16 lg:px-16 lg:py-24">
          <div className="">
            {/* Main Heading */}
            <h2 className="text-4xl md:text-5xl font-semibold text-[#181D27] leading-[1.1] mb-10">
              The Athlete Recruiting Roadmap: Grades 7th-12th Parent Timeline
            </h2>

            {/* Checklist */}
            <ul className="space-y-4 mb-12">
              {checklist.map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-[#079455] flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  </div>
                  <span className="text-gray-500 font-medium text-lg">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            {/* Subscription Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4 w-full"
            >
              <div className="flex flex-col sm:flex-row items-stretch gap-4 w-full">
                <div className="relative w-full sm:flex-1">
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="Enter your email"
                    className={`w-full px-6 py-4 rounded-full bg-white border ${errors.email ? "border-red-500" : "border-gray-100"
                      } shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] text-[#1A202C] placeholder:text-gray-400 focus:ring-2 focus:ring-[#10B981]/20 transition-all outline-none text-lg`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-green-600 py-4 text-center font-semibold hover:bg-green-700 disabled:opacity-70 text-white px-8 rounded-full bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 active:translate-y-0 active:shadow-md focus:outline-none cursor-pointer whitespace-nowrap"
                >
                  {isSubmitting ? "Sending..." : "Send Me The Roadmap"}
                </button>
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm ml-4 font-medium italic animate-fadeIn">
                  {errors.email.message}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Right Image Column */}
        <div className="relative overflow-hidden lg:rounded-tl-[4rem]">
          <img
            src={RecruitingRoadmapPhoto}
            alt="Basketball players competing"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default RecruitingRoadmap;
