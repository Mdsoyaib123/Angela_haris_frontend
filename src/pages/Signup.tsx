/* eslint-disable @typescript-eslint/no-explicit-any */
import AthleteProfileForm from "@/components/Home/Register/AthleteProfileForm"; // AthleteProfileData,
import CreateAccountForm from "@/components/Home/Register/CreateAccountForm";
import { useState, useEffect } from "react";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import { useTrackOrganizationMutation } from "@/redux/features/organization/organizationApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export interface Step1Data {
  athleteFullName: string;
  athleteEmail: string;
  athleteDateOfBirth: string; // Will be converted to YYYY-MM-DD
  parentFullName: string;
  parentEmail: string;
  password: string;
  referredBy?: string;
  role: string;
  phoneNumber?: string;
}

export interface Step2Data {
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

const emptyStep1Data: Step1Data = {
  athleteFullName: "",
  athleteEmail: "",
  athleteDateOfBirth: "",
  parentFullName: "",
  parentEmail: "",
  password: "",
  phoneNumber: "",
  referredBy: "",
  role: "PARENT",
};

const emptyStep2Data: Step2Data = {
  age: "",
  height: "",
  weight: "",
  sport: "Basketball",
  gradYear: "",
  primaryPosition: "",
  dominateHand: "",
  city: "",
  state: "",
  highSchool: "",
  aauClub: "",
  jerseyNumber: "",
  gpa: "",
  agreedToTerms: false,
  bio: "",
};

// Helper function to convert mm/dd/yyyy to yyyy-mm-dd
const formatDateForAPI = (dateString: string): string => {
  if (!dateString) return "";
  // If already in YYYY-MM-DD format (from native date input)
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;

  const parts = dateString.split("/");
  if (parts.length === 3) {
    return `${parts[2]}-${parts[0].padStart(2, "0")}-${parts[1].padStart(2, "0")}`;
  }
  return dateString;
};

// Helper function to convert height "5'6" to inches (66)
const convertHeightToNumeric = (heightString: string): number | null => {
  if (!heightString) return null;
  const match = heightString.match(/^(\d+)'(\d+)$/);
  if (match) {
    const feet = parseInt(match[1]);
    const inches = parseInt(match[2]);
    return feet * 12 + inches;
  }
  const numericOnly = parseFloat(heightString);
  return isNaN(numericOnly) ? null : numericOnly;
};

// Helper function to convert weight "180 lbs" to numeric (180)
const convertWeightToNumeric = (weightString: string): number | null => {
  if (!weightString) return null;
  const numericOnly = parseFloat(weightString);
  return isNaN(numericOnly) ? null : numericOnly;
};

export default function Signup() {
  const [currentStep, setCurrentStep] = useState(1);
  const [register, { isLoading }] = useRegisterMutation();
  const [trackOrganization] = useTrackOrganizationMutation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orgCode = searchParams.get("code");

  const [step1Data, setStep1Data] = useState<Step1Data>(emptyStep1Data);

  const [step2Data, setStep2Data] = useState<Step2Data>(emptyStep2Data);

  const handleStep1Submit = (data: Step1Data) => {
    setStep1Data(data);

    // Calculate age automatically
    if (data.athleteDateOfBirth) {
      const birthDate = new Date(data.athleteDateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setStep2Data((prev) => ({ ...prev, age: age.toString() }));
    }

    setCurrentStep(2);
  };

  const handleStep2Submit = async (data: Step2Data) => {
    setStep2Data(data);

    try {
      // Use FormData for multipart/form-data (required for image upload)
      const formData = new FormData();

      // Step 1 Data
      formData.append("athleteFullName", step1Data.athleteFullName);
      formData.append("athlateeEmail", step1Data.athleteEmail || ""); // Spec says 'athlateeEmail'
      formData.append(
        "dateOfBirth",
        formatDateForAPI(step1Data.athleteDateOfBirth),
      );
      formData.append("parentName", step1Data.parentFullName || "");
      formData.append("parentEmail", step1Data.parentEmail || "");
      formData.append("password", step1Data.password);
      formData.append("referredBy", step1Data.referredBy || "");
      formData.append("role", step1Data.role);

      formData.append("phoneNumber", step1Data.phoneNumber || "");

      // Step 2 Data - Aligning with backend spec
      formData.append("city", data.city || "");
      formData.append("state", data.state || "");

      // Numeric fields as numbers (sent as strings in FormData)
      const gradYear = parseInt(data.gradYear);
      formData.append("gradYear", isNaN(gradYear) ? "" : gradYear.toString());

      formData.append("position", data.primaryPosition || "");

      const height = convertHeightToNumeric(data.height);
      formData.append("height", height ? height.toString() : "");

      const weight = convertWeightToNumeric(data.weight);
      formData.append("weight", weight ? weight.toString() : "");

      formData.append("school", data.highSchool || "");

      formData.append("clubTeam", data.aauClub || "");

      formData.append("sports", data.sport || "");

      const gpa = parseFloat(data.gpa || "");
      formData.append("gpa", isNaN(gpa) ? "" : gpa.toString());

      formData.append("bio", data.bio || "");

      formData.append("dominateHand", data.dominateHand || "");

      formData.append("jerseyNumber", data.jerseyNumber || "");

      // Mandatory fcmToken for notifications (empty string for now)
      formData.append("fcmToken", "");

      if (orgCode) {
        formData.append("organizationCode", orgCode);
      } else {
        formData.append("organizationCode", "");
      }

      if (data.profileImage) {
        formData.append("image", data.profileImage);
      }

      const result = await register(formData).unwrap();

      if (result.success) {
        toast.success("Account created successfully!");

        // Track organization conversion if code was present
        if (orgCode) {
          try {
            await trackOrganization(orgCode).unwrap();
          } catch (err) {
            console.error("Failed to track organization conversion:", err);
          }
        }

        // Reset state
        setStep1Data(emptyStep1Data);
        setStep2Data(emptyStep2Data);
        setCurrentStep(1);

        navigate("/login");
      } else {
        toast.error(result.message || "Registration failed. Please try again.");
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      toast.error(
        err.data?.message ||
          err.message ||
          "Something went wrong. Please try again.",
      );
    }
  };

  const handleStep2Back = () => {
    setCurrentStep(1);
  };

  useEffect(() => {
    // Pre-populate referredBy if code exists in URL
    if (orgCode) {
      trackOrganization(orgCode);
      setStep1Data((prev) => {
        if (!prev.referredBy) {
          return { ...prev, referredBy: orgCode };
        }
        return prev;
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
      {currentStep === 1 ? (
        <CreateAccountForm
          initialData={step1Data || undefined}
          onNext={handleStep1Submit}
        />
      ) : (
        <AthleteProfileForm
          data={step2Data}
          role={step1Data.role}
          onBack={handleStep2Back}
          onSubmit={handleStep2Submit}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
