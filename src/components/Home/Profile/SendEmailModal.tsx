import React from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSendEmailMutation } from "@/redux/features/email/emailApi";
import { toast } from "sonner";

interface SendEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  email: string;
  subject: string;
  content: string;
  userName: string;
}

export const SendEmailModal: React.FC<SendEmailModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [sendEmail, { isLoading }] = useSendEmailMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      subject: "",
      content: "",
      userName: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await sendEmail(data).unwrap();
      if (response.success) {
        toast.success(response.message || "Email sent successfully");
        reset();
        onClose();
      } else {
        toast.error(response.message || "Failed to send email");
      }
    } catch (error) {
      toast.error("An error occurred while sending email");
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogOverlay className="bg-black/50 h-screen" />
      <DialogContent className="sm:max-w-md bg-white text-gray-900">
        <DialogHeader>
          <DialogTitle>Send Email</DialogTitle>
          <DialogDescription>
            Fill in the details to send an email.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Recipient Email <span className="text-red-500">*</span>
            </label>
            <Input
              id="email"
              type="email"
              placeholder="recipient@example.com"
              className="bg-white border-gray-300"
              {...register("email", {
                required: "Recipient email is required",
              })}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="userName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Recipient Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="userName"
              placeholder="John Doe"
              className="bg-white border-gray-300"
              {...register("userName", { required: "Your name is required" })}
            />
            {errors.userName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.userName.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Subject <span className="text-red-500">*</span>
            </label>
            <Input
              id="subject"
              placeholder="Subject"
              className="bg-white border-gray-300"
              {...register("subject", { required: "Subject is required" })}
            />
            {errors.subject && (
              <p className="text-sm text-red-500 mt-1">
                {errors.subject.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Message <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="content"
              rows={30} // Keep rows as fallback
              placeholder="Write your message here..."
              className="bg-white border-gray-300 lg:min-h-48" // Force minimum height
              {...register("content", { required: "Message is required" })}
            />
            {errors.content && (
              <p className="text-sm text-red-500 mt-1">
                {errors.content.message}
              </p>
            )}
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-2 bg-red-500 text-white font-medium rounded-full hover:bg-red-600 transition-all duration-300 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 text-white font-medium rounded-full bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 active:translate-y-0 active:shadow-md cursor-pointer flex justify-center items-center gap-2"
            >
              {isLoading ? "Sending..." : "Send Email"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
