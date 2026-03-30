import React, { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
} from "@/redux/features/profile/profileApi";
import { updateUser } from "@/redux/features/profile/authSlice.ts";
import { toast } from "sonner";
import { useAppDispatch } from "@/redux/hooks/redux-hook";

export default function UserSettings() {
  const dispatch = useAppDispatch();
  const { data: userData, isLoading: isUserLoading } = useGetCurrentUserQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const currentUser = userData?.data?.user;

  const [formData, setFormData] = useState({
    parentName: "",
    email: "",
    parentEmail: "",
    city: "",
    state: "",
    school: "",
    position: "",
    gradYear: "",
    height: "",
    weight: "",
    gpa: "",
  });

  // Load user data into form
  useEffect(() => {
    if (currentUser) {
      setFormData({
        parentName: currentUser.parentName || "",
        email: currentUser.email || "",
        parentEmail: currentUser.parentEmail || "",
        city: currentUser.city || "",
        state: currentUser.state || "",
        school: currentUser.school || "",
        position: currentUser.position || "",
        gradYear: currentUser.gradYear?.toString() || "",
        height: currentUser.height?.toString() || "",
        weight: currentUser.weight?.toString() || "",
        gpa: currentUser.gpa?.toString() || "",
      });
    }
  }, [currentUser]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) return;

    try {
      const payload: any = {};

      // Only send changed fields
      if (formData.parentName !== currentUser.parentName) {
        payload.parentName = formData.parentName;
      }
      if (formData.email !== currentUser.email) {
        payload.email = formData.email;
      }
      // if (formData.parentEmail !== currentUser.parentEmail) {
      //   payload.parentEmail = formData.parentEmail;
      // }
      if (formData.city !== currentUser.city) {
        payload.city = formData.city;
      }
      if (formData.state !== currentUser.state) {
        payload.state = formData.state;
      }
      if (formData.school !== currentUser.school) {
        payload.school = formData.school;
      }
      if (formData.position !== currentUser.position) {
        payload.position = formData.position;
      }
      if (formData.gradYear !== currentUser.gradYear?.toString()) {
        payload.gradYear = formData.gradYear
          ? parseInt(formData.gradYear)
          : undefined;
      }
      if (formData.height !== currentUser.height?.toString()) {
        payload.height = formData.height
          ? parseFloat(formData.height)
          : undefined;
      }
      if (formData.weight !== currentUser.weight?.toString()) {
        payload.weight = formData.weight
          ? parseFloat(formData.weight)
          : undefined;
      }
      if (formData.gpa !== currentUser.gpa?.toString()) {
        payload.gpa = formData.gpa ? parseFloat(formData.gpa) : undefined;
      }

      if (Object.keys(payload).length === 0) {
        toast.info("No changes to update");
        return;
      }

      const response = await updateProfile(payload).unwrap();

      if (response.success) {
        dispatch(
          updateUser({
            ...response.data,
          }),
        );
        toast.success("Profile updated successfully");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update profile");
    }
  };

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-[#EFEEEE] shadow-lg p-3 sm:p-4 md:p-6 w-full">
        <h2 className="text-lg font-semibold text-foreground mb-6">
          Account Details
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Parent Name and Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Parent Name */}
            <div className="space-y-2">
              <Label
                htmlFor="parentName"
                className="text-sm text-muted-foreground"
              >
                Parent Name
              </Label>
              <Input
                id="parentName"
                value={formData.parentName}
                onChange={(e) =>
                  handleInputChange("parentName", e.target.value)
                }
                className="w-full bg-background border-[#EFEEEE] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#EFEEEE]"
              />
            </div>
            {/* Parent Email */}
            {/* <div className="space-y-2">
              <Label
                htmlFor="parentEmail"
                className="text-sm text-muted-foreground"
              >
                Parent Email
              </Label>
              <Input
                id="parentEmail"
                type="email"
                value={formData.parentEmail}
                onChange={(e) =>
                  handleInputChange("parentEmail", e.target.value)
                }
                className="w-full bg-background border-[#EFEEEE] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#EFEEEE]"
              />
            </div> */}
          </div>

          {/* Email & City/State */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-muted-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full bg-background border-[#EFEEEE] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#EFEEEE]"
              />
            </div>
            {/* City */}
            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm text-muted-foreground">
                City
              </Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className="w-full bg-background border-[#EFEEEE] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#EFEEEE]"
              />
            </div>
            {/* State */}
            <div className="space-y-2">
              <Label htmlFor="state" className="text-sm text-muted-foreground">
                State
              </Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                className="w-full bg-background border-[#EFEEEE] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#EFEEEE]"
              />
            </div>
          </div>

          {/* School & Position */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* School */}
            <div className="space-y-2">
              <Label htmlFor="school" className="text-sm text-muted-foreground">
                School
              </Label>
              <Input
                id="school"
                value={formData.school}
                onChange={(e) => handleInputChange("school", e.target.value)}
                className="w-full bg-background border-[#EFEEEE] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#EFEEEE]"
              />
            </div>
            {/* Position */}
            <div className="space-y-2">
              <Label
                htmlFor="position"
                className="text-sm text-muted-foreground"
              >
                Position
              </Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => handleInputChange("position", e.target.value)}
                className="w-full bg-background border-[#EFEEEE] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#EFEEEE]"
              />
            </div>
          </div>

          {/* Grad Year, Height, Weight, GPA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Graduation Year */}
            <div className="space-y-2">
              <Label
                htmlFor="gradYear"
                className="text-sm text-muted-foreground"
              >
                Graduation Year
              </Label>
              <Input
                id="gradYear"
                type="number"
                value={formData.gradYear}
                onChange={(e) => handleInputChange("gradYear", e.target.value)}
                className="w-full bg-background border-[#EFEEEE] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#EFEEEE]"
              />
            </div>

            {/* Height */}
            <div className="space-y-2">
              <Label htmlFor="height" className="text-sm text-muted-foreground">
                Height (cm)
              </Label>
              <Input
                id="height"
                type="number"
                step="0.1"
                value={formData.height}
                onChange={(e) => handleInputChange("height", e.target.value)}
                className="w-full bg-background border-[#EFEEEE] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#EFEEEE]"
              />
            </div>

            {/* Weight */}
            <div className="space-y-2">
              <Label htmlFor="weight" className="text-sm text-muted-foreground">
                Weight (kg)
              </Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={(e) => handleInputChange("weight", e.target.value)}
                className="w-full bg-background border-[#EFEEEE] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#EFEEEE]"
              />
            </div>

            {/* GPA */}
            <div className="space-y-2">
              <Label htmlFor="gpa" className="text-sm text-muted-foreground">
                GPA
              </Label>
              <Input
                id="gpa"
                type="number"
                step="0.01"
                min="0"
                max="4"
                value={formData.gpa}
                onChange={(e) => handleInputChange("gpa", e.target.value)}
                className="w-full bg-background border-[#EFEEEE] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#EFEEEE]"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={isUpdating}
              className="mt-6 px-4 py-5 text-white rounded-full bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 active:translate-y-0 active:shadow-md focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4 mr-2" />
              {isUpdating ? "Updating..." : "Update Identity"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// import React from "react";
// import { useState } from "react";
// import { Save } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// export default function UserSettings() {
//   const [accountDetailsData, setAccountDetailsData] = useState({
//     parentName: "",
//     relationToAthlet: "",
//     email: "",
//     phone: "",
//     timeZone: "",
//     preferredLanguage: "",
//     notificationPreferences: "",
//     aauOrTeam: "",
//     contactName: "",
//     contactNumber: "",
//     contactEmail: "",
//   });

//   const handleInputChange = (field: string, value: string) => {
//     setAccountDetailsData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleAccountDetailsSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log("Form submitted:", accountDetailsData);
//   };

//   const relationshipToAthlet = ["Brother", "Sister"];
//   const preferredLanguage = ["English", "Bengali"];
//   const notificationPreferences = ["English", "Bengali"];

//   return (
//     <>
//       <div className="space-y-6">
//         <div className="bg-white rounded-xl border border-[#EFEEEE] shadow-lg p-3 sm:p-4 md:p-6 w-full">
//           <h2 className="text-lg font-semibold text-foreground mb-6">
//             Account Details
//           </h2>

//           <form onSubmit={handleAccountDetailsSubmit} className="space-y-6">
//             {/* Parent Name and Relationship to athlete */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
//               {/* Parent Name */}
//               <div className="space-y-2">
//                 <Label
//                   htmlFor="parentName"
//                   className="text-sm text-muted-foreground"
//                 >
//                   Parent Name
//                 </Label>
//                 <Input
//                   id="parentName"
//                   value={accountDetailsData.parentName}
//                   onChange={(e) =>
//                     handleInputChange("parentName", e.target.value)
//                   }
//                   className="w-full bg-background border-[#EFEEEE] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#EFEEEE]"
//                 />
//               </div>
//               {/* Relationship to athlete */}
//               <div className="space-y-2">
//                 <Label className="text-sm text-muted-foreground">
//                   Relationship to Athlete
//                 </Label>
//                 <Select
//                   value={accountDetailsData.relationToAthlet}
//                   onValueChange={(value) =>
//                     handleInputChange("relationToAthlet", value)
//                   }
//                 >
//                   <SelectTrigger className="w-full bg-background border-[#EFEEEE] focus:ring-0 focus:ring-offset-0 focus:border-[#EFEEEE] cursor-pointer">
//                     <SelectValue placeholder="Select Relationship to Athlete" />
//                   </SelectTrigger>
//                   <SelectContent className="bg-white max-h-60">
//                     {relationshipToAthlet.map((relation) => (
//                       <SelectItem
//                         key={relation}
//                         value={relation}
//                         className="cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
//                       >
//                         {relation}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>

//             {/* Email & Phone Number */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
//               {/* Email */}
//               <div className="space-y-2">
//                 <Label
//                   htmlFor="email"
//                   className="text-sm text-muted-foreground"
//                 >
//                   Email
//                 </Label>
//                 <Input
//                   id="email"
//                   value={accountDetailsData.email}
//                   type="email"
//                   onChange={(e) => handleInputChange("email", e.target.value)}
//                   className="w-full bg-background border-[#EFEEEE] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#EFEEEE]"
//                 />
//               </div>
//               {/* Phone Number */}
//               <div className="space-y-2">
//                 <Label
//                   htmlFor="phone"
//                   className="text-sm text-muted-foreground"
//                 >
//                   Phone Number
//                 </Label>
//                 <Input
//                   id="phone"
//                   value={accountDetailsData.phone}
//                   onChange={(e) => handleInputChange("phone", e.target.value)}
//                   className="w-full bg-background border-[#EFEEEE] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#EFEEEE]"
//                 />
//               </div>
//             </div>

//             {/* Timezone, preferred language & notification preference */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
//               {/* Timezone */}
//               <div className="space-y-2">
//                 <Label
//                   htmlFor="timeZone"
//                   className="text-sm text-muted-foreground"
//                 >
//                   Time-zone
//                 </Label>
//                 <Input
//                   id="timeZone"
//                   value={accountDetailsData.timeZone}
//                   onChange={(e) =>
//                     handleInputChange("timeZone", e.target.value)
//                   }
//                   className="w-full bg-background border-[#EFEEEE] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#EFEEEE]"
//                 />
//               </div>
//               {/* Preferred Language */}
//               <div className="space-y-2">
//                 <Label className="text-sm text-muted-foreground">
//                   Preferred Language
//                 </Label>
//                 <Select
//                   value={accountDetailsData.preferredLanguage}
//                   onValueChange={(value) =>
//                     handleInputChange("preferredLanguage", value)
//                   }
//                 >
//                   <SelectTrigger className="w-full bg-background border-[#EFEEEE] focus:ring-0 focus:ring-offset-0 focus:border-[#EFEEEE] cursor-pointer">
//                     <SelectValue placeholder="Select a Preferred Language" />
//                   </SelectTrigger>
//                   <SelectContent className="bg-white max-h-60">
//                     {preferredLanguage.map((weight) => (
//                       <SelectItem
//                         key={weight}
//                         value={weight}
//                         className="cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
//                       >
//                         {weight}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//               {/* Notification Preferences */}
//               <div className="space-y-2">
//                 <Label className="text-sm text-muted-foreground">
//                   Notification Preferences
//                 </Label>
//                 <Select
//                   value={accountDetailsData.notificationPreferences}
//                   onValueChange={(value) =>
//                     handleInputChange("notificationPreferences", value)
//                   }
//                 >
//                   <SelectTrigger className="w-full bg-background border-[#EFEEEE] focus:ring-0 focus:ring-offset-0 focus:border-[#EFEEEE] cursor-pointer">
//                     <SelectValue placeholder="Select Notification Preferences" />
//                   </SelectTrigger>
//                   <SelectContent className="bg-white max-h-60">
//                     {notificationPreferences.map((weight) => (
//                       <SelectItem
//                         key={weight}
//                         value={weight}
//                         className="cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
//                       >
//                         {weight}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>

//             {/* Manage Team Section */}
//             <div className="pt-4">
//               <h3 className="text-base font-semibold text-foreground mb-4">
//                 Manage Team
//               </h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
//                 <div className="space-y-2">
//                   <Label
//                     htmlFor="aauOrTeam"
//                     className="text-sm text-muted-foreground"
//                   >
//                     AAU Club / Team Name
//                   </Label>
//                   <Input
//                     id="aauOrTeam"
//                     value={accountDetailsData.aauOrTeam}
//                     onChange={(e) =>
//                       handleInputChange("aauOrTeam", e.target.value)
//                     }
//                     className="w-full bg-background border-[#EFEEEE] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#EFEEEE]"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label
//                     htmlFor="contactName"
//                     className="text-sm text-muted-foreground"
//                   >
//                     Contact Name
//                   </Label>
//                   <Input
//                     id="contactName"
//                     value={accountDetailsData.contactName}
//                     onChange={(e) =>
//                       handleInputChange("contactName", e.target.value)
//                     }
//                     className="w-full bg-background border-[#EFEEEE] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#EFEEEE]"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label
//                     htmlFor="contactNumber"
//                     className="text-sm text-muted-foreground"
//                   >
//                     Contact Phone Number
//                   </Label>
//                   <Input
//                     id="contactNumber"
//                     value={accountDetailsData.contactNumber}
//                     onChange={(e) =>
//                       handleInputChange("contactNumber", e.target.value)
//                     }
//                     className="w-full bg-background border-[#EFEEEE] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#EFEEEE]"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label
//                     htmlFor="contactEmail"
//                     className="text-sm text-muted-foreground"
//                   >
//                     Contact Email
//                   </Label>
//                   <Input
//                     id="contactEmail"
//                     value={accountDetailsData.contactEmail}
//                     onChange={(e) =>
//                       handleInputChange("contactEmail", e.target.value)
//                     }
//                     className="w-full bg-background border-[#EFEEEE] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#EFEEEE]"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <div className="pt-4">
//               <Button
//                 type="submit"
//                 className="mt-6 px-4 py-5 text-white rounded-full bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 active:translate-y-0 active:shadow-md focus:outline-none cursor-pointer"
//               >
//                 <Save className="w-4 h-4" />
//                 Update identity
//               </Button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// }
