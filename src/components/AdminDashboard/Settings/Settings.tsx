import { useState, useEffect } from "react";
import { Save, User, Briefcase, Mail, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
// import SecurityAccess from "./SecurityAccess";
// import ChangePasswordDialog from "./ChangePasswordDialog";

import {
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
} from "@/redux/features/profile/profileApi";

import { updateUser } from "@/redux/features/profile/authSlice.ts";
import { toast } from "sonner";
import { useAppDispatch } from "@/redux/hooks/redux-hook";
import ChangesPassword from "@/components/ClientDashboard/UserSettings/ChangesPassword";

const Settings = () => {
  const dispatch = useAppDispatch();

  const { data: userData, isLoading: isUserLoading } = useGetCurrentUserQuery();

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  // const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    adminTitle: "",
    professionalEmail: "",
  });

  // ✅ Get user safely from API response
  const currentUser = userData?.data?.user;
  // const currentUser = userData?.data;

  // ✅ Load user data into form
  useEffect(() => {
    if (currentUser) {
      setFormData({
        fullName: currentUser.athleteFullName || "",
        adminTitle: currentUser.adminTilte || "",
        professionalEmail: currentUser.email || "",
      });

      setImagePreview(currentUser.imgUrl || null);
    }
  }, [currentUser]);

  // ✅ Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setSelectedImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // ✅ Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) return;

    try {
      const payload: any = {};

      // Only send changed fields
      if (formData.fullName !== currentUser.athleteFullName) {
        payload.athleteFullName = formData.fullName;
      }

      if (formData.adminTitle !== currentUser.adminTilte) {
        payload.adminTilte = formData.adminTitle;
      }

      if (formData.professionalEmail !== currentUser.email) {
        payload.email = formData.professionalEmail;
      }

      if (selectedImage) {
        payload.image = selectedImage;
      }

      if (Object.keys(payload).length === 0) {
        toast.info("No changes to update");
        return;
      }

      const response = await updateProfile(payload).unwrap();

      if (response.success) {
        dispatch(
          updateUser({
            athleteFullName: response.data.athleteFullName,
            adminTilte: response.data.adminTilte,
            email: response.data.email,
            imgUrl: response.data.imgUrl,
          }),
        );

        toast.success("Profile updated successfully");
        setSelectedImage(null);
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
    <div>
      <div className="w-full mb-6">
        <div>
          <div className="xl:col-span-8 bg-white rounded-xl border border-[#EFEEEE] shadow-lg p-4 w-full flex flex-col">
            <h2 className="text-lg font-semibold text-foreground">
              Account Details
            </h2>

            {/* Profile Image */}
            <div className="mt-4 flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <User className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>

                <label
                  htmlFor="profile-image"
                  className="absolute bottom-0 right-0 bg-green-500 rounded-full p-1.5 cursor-pointer hover:bg-green-600"
                >
                  <Camera className="w-4 h-4 text-white" />
                </label>

                <input
                  type="file"
                  id="profile-image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              <div className="text-sm text-gray-500">
                <p>Click camera icon to upload profile picture</p>
                <p className="text-xs">JPG, PNG or GIF (max 2MB)</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 mb-4 grow">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 pl-10 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>

                {/* Admin Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Admin Title
                  </label>
                  <div className="relative mt-1">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      name="adminTitle"
                      value={formData.adminTitle}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 pl-10 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Professional Email
                  </label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      name="professionalEmail"
                      value={formData.professionalEmail}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 pl-10 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="mt-auto flex justify-start">
                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="rounded-full cursor-pointer px-6 py-3 text-white bg-gradient-to-b from-green-500 to-green-800"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isUpdating ? "Updating..." : "Update Identity"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* <SecurityAccess onPasswordChange={() => setIsPasswordDialogOpen(true)} />

      <ChangePasswordDialog
        isOpen={isPasswordDialogOpen}
        onClose={() => setIsPasswordDialogOpen(false)}
      /> */}
      <ChangesPassword />
    </div>
  );
};

export default Settings;

// import { useState, useEffect } from "react";
// import { Save, User, Briefcase, Mail, Camera } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import SecurityAccess from "./SecurityAccess";

// import {
//   useGetCurrentUserQuery,
//   useUpdateProfileMutation,
// } from "@/redux/features/profile/profileApi";

// import { updateUser } from "@/redux/features/profile/authSlice.ts";
// import { toast } from "sonner";
// import { useAppDispatch } from "@/redux/hooks/redux-hook";
// import ChangePasswordDialog from "./ChangePasswordDialog";

// const Settings = () => {
//   const dispatch = useAppDispatch();
//   const { data: userData, isLoading: isUserLoading } = useGetCurrentUserQuery();
//   const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

//   console.log(userData);

//   const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
//   const [selectedImage, setSelectedImage] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);

//   const [formData, setFormData] = useState({
//     fullName: "",
//     adminTitle: "",
//     professionalEmail: "",
//   });

//   // Load user data when available
//   useEffect(() => {
//     if (userData?.data) {
//       setFormData({
//         fullName: userData.data.athleteFullName || "",
//         adminTitle: userData.data.adminTilte || "",
//         professionalEmail: userData.data.email || "",
//       });
//       setImagePreview(userData.data.imgUrl || null);
//     }
//   }, [userData]);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setSelectedImage(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       const payload: any = {};

//       // Only include fields that have changed
//       if (formData.fullName !== userData?.data?.athleteFullName) {
//         payload.athleteFullName = formData.fullName;
//       }
//       if (formData.adminTitle !== userData?.data?.adminTilte) {
//         payload.adminTilte = formData.adminTitle;
//       }
//       if (formData.professionalEmail !== userData?.data?.email) {
//         payload.email = formData.professionalEmail;
//       }
//       if (selectedImage) {
//         payload.image = selectedImage;
//       }

//       // Only call API if there are changes
//       if (Object.keys(payload).length === 0) {
//         toast.info("No changes to update");
//         return;
//       }

//       const response = await updateProfile(payload).unwrap();

//       if (response.success) {
//         // Update Redux state
//         dispatch(
//           updateUser({
//             athleteFullName: response.data.athleteFullName,
//             adminTilte: response.data.adminTilte,
//             email: response.data.email,
//             imgUrl: response.data.imgUrl,
//           }),
//         );

//         toast.success("Profile updated successfully");

//         // Clear selected image after successful upload
//         setSelectedImage(null);
//       }
//     } catch (error: any) {
//       toast.error(error?.data?.message || "Failed to update profile");
//     }
//   };

//   if (isUserLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500" />
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="w-full mb-6">
//         {/* MAIN GRID */}
//         <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-stretch">
//           {/* ================= LEFT: ACCOUNT DETAILS ================= */}
//           <div className="xl:col-span-8 bg-white rounded-xl border border-[#EFEEEE] shadow-lg p-4 w-full flex flex-col">
//             <h2 className="text-lg font-semibold text-foreground">
//               Account Details
//             </h2>

//             {/* Profile Image Upload */}
//             <div className="mt-4 flex items-center gap-4">
//               <div className="relative">
//                 <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
//                   {imagePreview ? (
//                     <img
//                       src={imagePreview}
//                       alt="Profile"
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <div className="w-full h-full flex items-center justify-center bg-gray-200">
//                       <User className="w-8 h-8 text-gray-400" />
//                     </div>
//                   )}
//                 </div>
//                 <label
//                   htmlFor="profile-image"
//                   className="absolute bottom-0 right-0 bg-green-500 rounded-full p-1.5 cursor-pointer hover:bg-green-600 transition-colors"
//                 >
//                   <Camera className="w-4 h-4 text-white" />
//                 </label>
//                 <input
//                   type="file"
//                   id="profile-image"
//                   accept="image/*"
//                   onChange={handleImageChange}
//                   className="hidden"
//                 />
//               </div>
//               <div className="text-sm text-gray-500">
//                 <p>Click the camera icon to upload a profile picture</p>
//                 <p className="text-xs">JPG, PNG or GIF (max. 2MB)</p>
//               </div>
//             </div>

//             {/* FORM GRID */}
//             <form onSubmit={handleSubmit} className="flex flex-col h-full">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 mb-4 grow">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">
//                     Full Name
//                   </label>

//                   <div className="relative mt-1">
//                     <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

//                     <input
//                       type="text"
//                       name="fullName"
//                       value={formData.fullName}
//                       onChange={handleInputChange}
//                       placeholder="Enter your full name"
//                       className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pl-10 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-200"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">
//                     Admin Title
//                   </label>

//                   <div className="relative mt-1">
//                     <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

//                     <input
//                       type="text"
//                       name="adminTitle"
//                       value={formData.adminTitle}
//                       onChange={handleInputChange}
//                       placeholder="Enter your admin title"
//                       className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pl-10 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-200"
//                     />
//                   </div>
//                 </div>

//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700">
//                     Professional Email
//                   </label>

//                   <div className="relative mt-1">
//                     <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

//                     <input
//                       type="email"
//                       name="professionalEmail"
//                       value={formData.professionalEmail}
//                       onChange={handleInputChange}
//                       placeholder="Enter your email"
//                       className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pl-10 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-200"
//                       required
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* BUTTON STAYS AT BOTTOM WITH FIXED SIZE */}
//               <div className="mt-auto flex justify-start">
//                 <Button
//                   type="submit"
//                   disabled={isUpdating}
//                   className="w-45 lg:w-55 min-h-9 lg:min-h-12.5 flex items-center justify-center rounded-full px-6 py-3 text-white bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 active:translate-y-0 active:shadow-md focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
//                 >
//                   <Save className="w-4 h-4 mr-2 inline-block" />
//                   {isUpdating ? "Updating..." : "Update identity"}
//                 </Button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>

//       <SecurityAccess onPasswordChange={() => setIsPasswordDialogOpen(true)} />

//       <ChangePasswordDialog
//         isOpen={isPasswordDialogOpen}
//         onClose={() => setIsPasswordDialogOpen(false)}
//       />
//     </div>
//   );
// };

// export default Settings;

// import { useState } from "react";
// import { Save } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { User, Briefcase, Mail } from "lucide-react";
// import SecurityAccess from "./SecurityAccess";

// const Settings = () => {
//   const [formData, setFormData] = useState({
//     fullName: "",
//     adminTitle: "",
//     professionalEmail: "",
//   });

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   return (
//     <div>
//       <div className="w-full mb-6">
//         {/* MAIN GRID */}
//         <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-stretch">
//           {/* ================= LEFT: ACCOUNT DETAILS ================= */}
//           <div className="xl:col-span-8 bg-white rounded-xl border border-[#EFEEEE] shadow-lg p-4 w-full flex flex-col">
//             <h2 className="text-lg font-semibold text-foreground">
//               Account Details
//             </h2>

//             {/* FORM GRID */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 mb-4 grow">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Full Name
//                 </label>

//                 <div className="relative mt-1">
//                   <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

//                   <input
//                     type="text"
//                     name="fullName"
//                     value={formData.fullName}
//                     onChange={handleInputChange}
//                     placeholder="Enter your full name"
//                     className=" w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pl-10 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-200"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Admin Title
//                 </label>

//                 <div className="relative mt-1">
//                   <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

//                   <input
//                     type="text"
//                     name="adminTitle"
//                     value={formData.adminTitle}
//                     onChange={handleInputChange}
//                     placeholder="Enter your admin title"
//                     className=" w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pl-10 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-200"
//                   />
//                 </div>
//               </div>

//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Professional Email
//                 </label>

//                 <div className="relative mt-1">
//                   <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

//                   <input
//                     type="email"
//                     name="professionalEmail"
//                     value={formData.professionalEmail}
//                     onChange={handleInputChange}
//                     placeholder="Enter your email"
//                     className=" w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pl-10 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-200"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* BUTTON STAYS AT BOTTOM WITH FIXED SIZE */}
//             <div className="mt-auto flex justify-start">
//               <Button
//                 type="submit"
//                 className="w-45 lg:w-55 min-h-9 lg:min-h-12.5 flex items-center justify-center rounded-full px-6 py-3 text-white bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 active:translate-y-0 active:shadow-md focus:outline-none cursor-pointer"
//               >
//                 <Save className="w-4 h-4 mr-2 inline-block" />
//                 Update identity
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <SecurityAccess />
//     </div>
//   );
// };

// export default Settings;

// import { useState } from "react";
// import { Save } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { LogOut } from "lucide-react";
// import { User, Briefcase, Mail } from "lucide-react";
// import SecurityAccess from "./SecurityAccess";
// import AlertToggleItem from "./AlertToggleItem";

// const Settings = () => {
//   const [formData, setFormData] = useState({
//     fullName: "",
//     adminTitle: "",
//     professionalEmail: "",
//   });

//   const [alerts, setAlerts] = useState({
//     newSubscriptions: true,
//     criticalErrors: true,
//     userReports: true,
//     marketingLogs: true,
//   });

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleToggle = (key: keyof typeof alerts) => {
//     setAlerts((prev) => ({
//       ...prev,
//       [key]: !prev[key],
//     }));
//   };
//   return (
//     <div>
//       <div className="w-full mb-6">
//         {/* MAIN GRID */}
//         <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-stretch">
//           {/* ================= LEFT: ACCOUNT DETAILS ================= */}
//           <div
//             className="
//         xl:col-span-8
//         bg-white rounded-xl
//         border border-[#EFEEEE]
//         shadow-lg
//         p-4
//         w-full
//         flex flex-col
//       "
//           >
//             <h2 className="text-lg font-semibold text-foreground">
//               Account Details
//             </h2>

//             {/* FORM GRID */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 mb-4 grow">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Full Name
//                 </label>

//                 <div className="relative mt-1">
//                   <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

//                   <input
//                     type="text"
//                     name="fullName"
//                     value={formData.fullName}
//                     onChange={handleInputChange}
//                     placeholder="Enter your full name"
//                     className="
//   w-full rounded-lg border border-gray-300 bg-white
//   px-4 py-2.5 pl-10
//   focus:outline-none
//   focus:border-green-500
//   focus:ring-1 focus:ring-green-500
//   transition-all duration-200
// "
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Admin Title
//                 </label>

//                 <div className="relative mt-1">
//                   <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

//                   <input
//                     type="text"
//                     name="adminTitle"
//                     value={formData.adminTitle}
//                     onChange={handleInputChange}
//                     placeholder="Enter your admin title"
//                     className="
//   w-full rounded-lg border border-gray-300 bg-white
//   px-4 py-2.5 pl-10
//   focus:outline-none
//   focus:border-green-500
//   focus:ring-1 focus:ring-green-500
//   transition-all duration-200
// "
//                   />
//                 </div>
//               </div>

//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Professional Email
//                 </label>

//                 <div className="relative mt-1">
//                   <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

//                   <input
//                     type="email"
//                     name="professionalEmail"
//                     value={formData.professionalEmail}
//                     onChange={handleInputChange}
//                     placeholder="Enter your email"
//                     className="
//   w-full rounded-lg border border-gray-300 bg-white
//   px-4 py-2.5 pl-10
//   focus:outline-none
//   focus:border-green-500
//   focus:ring-1 focus:ring-green-500
//   transition-all duration-200
// "
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* BUTTON STAYS AT BOTTOM WITH FIXED SIZE */}
//             <div className="mt-auto flex justify-start">
//               <Button
//                 type="submit"
//                 className="w-45 lg:w-55 min-h-9 lg:min-h-12.5 flex items-center justify-center rounded-full px-6 py-3 text-white bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 active:translate-y-0 active:shadow-md focus:outline-none cursor-pointer"
//               >
//                 <Save className="w-4 h-4 mr-2 inline-block" />
//                 Update identity
//               </Button>
//             </div>
//           </div>

//           {/* ================= RIGHT: SIDEBAR ================= */}
//           <div className="xl:col-span-4 flex flex-col w-full justify-between gap-4">
//             {/* Alert Preferences */}
//             <div
//               className="
//           bg-white rounded-xl
//           border border-[#EFEEEE]
//           shadow-lg
//           p-4
//           flex flex-col
//           flex-1
//         "
//             >
//               <h1 className="text-lg font-semibold text-gray-900">
//                 Alert Preferences
//               </h1>

//               <div className="mt-2 flex flex-col gap-2">
//                 <AlertToggleItem
//                   label="New Subscriptions"
//                   checked={alerts.newSubscriptions}
//                   onChange={() => handleToggle("newSubscriptions")}
//                 />
//                 <AlertToggleItem
//                   label="Critical Errors"
//                   checked={alerts.criticalErrors}
//                   onChange={() => handleToggle("criticalErrors")}
//                 />
//                 <AlertToggleItem
//                   label="User Reports"
//                   checked={alerts.userReports}
//                   onChange={() => handleToggle("userReports")}
//                 />
//               </div>
//             </div>

//             {/* Logout Button */}
//             <button className="w-full rounded-full border-2 border-green-600 px-6 py-3 text-green-600 hover:bg-green-50 cursor-pointer">
//               <LogOut className="inline-block w-5 h-5 mr-2" />
//               Terminate Admin Session
//             </button>
//           </div>
//         </div>
//       </div>

//       <SecurityAccess />
//     </div>
//   );
// };

// export default Settings;
