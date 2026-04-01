import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { User, X, Loader2 } from "lucide-react";
import { LuPencilLine } from "react-icons/lu";
import { MdOutlineFileUpload } from "react-icons/md";
import { useUpdateProfileMutation } from "@/redux/features/profile/profileApi";
import { toast } from "sonner";
import { UpdateProfilePayload, ProfileData } from "@/redux/types/profile.types";

interface EditProfileModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
  user: ProfileData; // Added user prop
}

interface FormDataState {
  athleteFullName: string;
  email: string;
  city: string;
  state: string;
  height: string;
  weight: string;
  gradYear: string;
  school: string;
  bio: string;
  position: string;
  gpa: string;
  parentName: string;
  dateOfBirth: string;
  ppg: string;
  rpg: string;
  apg: string;
  spg: string;
  bpg: string;
  adminTilte: string;
  aauClub: string;
  parentEmail: string;
  phoneNumber: string;
  clubTeam: string;
  sports: string;
  dominateHand: string;
  jerseyNumber: string;
}

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

export default function EditProfileModal({
  isOpen = true,
  onClose,
  onSuccess,
  user, // Now using the passed user prop
}: EditProfileModalProps) {
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const [formData, setFormData] = useState<FormDataState>({
    athleteFullName: user?.athleteFullName || "",
    email: user?.email || "",
    city: user?.city || "",
    state: user?.state || "",
    height: user?.height?.toString() || "",
    weight: user?.weight?.toString() || "",
    gradYear: user?.gradYear?.toString() || "",
    school: user?.school || "",
    bio: user?.bio || "",
    position: user?.position || "Point Guard",
    gpa: user?.gpa?.toString() || "",
    parentName: user?.parentName || "",
    dateOfBirth: user?.dateOfBirth ? user.dateOfBirth.split("T")[0] : "",
    ppg: user?.ppg?.toString() || "",
    rpg: user?.rpg?.toString() || "",
    apg: user?.apg?.toString() || "",
    spg: user?.spg?.toString() || "",
    bpg: user?.blk?.toString() || "",
    adminTilte: user?.adminTilte || "",
    aauClub: user?.aauClub || "",
    parentEmail: user?.parentEmail || "",
    phoneNumber: user?.phoneNumber || "",
    clubTeam: user?.clubTeam || "",
    sports: user?.sports || "Basketball",
    dominateHand: user?.dominateHand || "",
    jerseyNumber: user?.jerseyNumber?.toString() || "",
  });

  const [errors, setErrors] = useState<{ bio?: string }>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(
    user?.imgUrl || null,
  );
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  // Update form when user prop changes (e.g., after successful save)
  useEffect(() => {
    if (user) {
      setFormData({
        athleteFullName: user.athleteFullName || "",
        email: user.email || "",
        city: user.city || "",
        state: user.state || "",
        height: user.height?.toString() || "",
        weight: user.weight?.toString() || "",
        gradYear: user.gradYear?.toString() || "",
        school: user.school || "",
        bio: user.bio || "",
        position: user.position || "Point Guard",
        gpa: user.gpa?.toString() || "",
        parentName: user.parentName || "",
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "",
        ppg: user.ppg?.toString() || "",
        rpg: user.rpg?.toString() || "",
        apg: user.apg?.toString() || "",
        spg: user.spg?.toString() || "",
        bpg: user.blk?.toString() || "",
        adminTilte: user.adminTilte || "",
        aauClub: user.aauClub || "",
        parentEmail: user.parentEmail || "",
        phoneNumber: user.phoneNumber || "",
        clubTeam: user.clubTeam || "",
        sports: user.sports || "Basketball",
        dominateHand: user.dominateHand || "",
        jerseyNumber: user.jerseyNumber?.toString() || "",
      });
      setProfilePreview(user.imgUrl || null);
    }
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // const handleSelectChange = (name: string, value: string) => {
  //   setFormData((prev) => ({ ...prev, [name]: value }));
  // };

  const handleProfileClick = () => {
    fileInputRef.current?.click();
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setProfilePreview(url);
      setSelectedImage(file);
    }
  };

  const handleSubmit = async () => {
    const newErrors: { bio?: string } = {};

    if (!formData.bio || formData.bio.trim() === "") {
      newErrors.bio = "Bio is required";
    } else if (formData.bio.length > 100) {
      newErrors.bio = "Bio must be at most 100 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const payload: UpdateProfilePayload = {};

      // Helper to set string fields
      const setStringField = (
        field: keyof Pick<
          UpdateProfilePayload,
          | "athleteFullName"
          | "email"
          | "city"
          | "state"
          | "school"
          | "bio"
          | "position"
          | "parentName"
          | "dateOfBirth"
          | "adminTilte"
          | "aauClub"
          | "parentEmail"
          | "phoneNumber"
          | "clubTeam"
          | "sports"
          | "dominateHand"
        >,
      ) => {
        const value = formData[field];
        payload[field] = value || "";
      };

      const setNumberField = (
        field: keyof Pick<
          UpdateProfilePayload,
          | "height"
          | "weight"
          | "gpa"
          | "ppg"
          | "rpg"
          | "apg"
          | "spg"
          | "blk"
          | "gradYear"
          | "jerseyNumber"
        >,
      ) => {
        const formDataKey = field === "blk" ? "bpg" : field;
        const value = formData[formDataKey as keyof FormDataState];
        if (value && value.trim() !== "") {
          const num = parseFloat(value);
          if (!isNaN(num)) {
            payload[field] = num;
          } else {
            payload[field] = "";
          }
        } else {
          payload[field] = "";
        }
      };

      // Set all string fields
      setStringField("athleteFullName");
      setStringField("email");
      setStringField("city");
      setStringField("state");
      setStringField("school");
      setStringField("bio");
      setStringField("position");
      setStringField("parentName");
      setStringField("dateOfBirth");
      setStringField("adminTilte");
      setStringField("aauClub");
      setStringField("parentEmail");
      setStringField("phoneNumber");
      setStringField("clubTeam");
      setStringField("sports");
      setStringField("dominateHand");

      // Set all number fields
      setNumberField("height");
      setNumberField("weight");
      setNumberField("gpa");
      setNumberField("ppg");
      setNumberField("rpg");
      setNumberField("apg");
      setNumberField("spg");
      setNumberField("blk");
      setNumberField("gradYear");
      setNumberField("jerseyNumber");

      // Add image if selected
      if (selectedImage) {
        payload.image = selectedImage;
      }

      const response = await updateProfile(payload).unwrap();

      if (response.success) {
        toast.success("Profile updated successfully!");
        onSuccess?.();
        onClose?.();
      }
    } catch {
      toast.error("Failed to update profile");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed h-screen inset-0 flex items-center justify-center p-4 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto overscroll-contain scrollbar-hide">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleProfileChange}
        />

        {/* Header */}
        <div
          className="sticky top-0 z-20 flex items-center justify-between
                        bg-gray-50 px-6 pt-6 pb-4 border-b border-[#C6CAD1]"
        >
          <h2 className="text-lg font-semibold text-gray-800">
            Edit Profile Informations
          </h2>
          <button
            onClick={onClose}
            className="text-[#28303F] cursor-pointer"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          {/* Profile Section */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div className="relative shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200 shadow-sm">
                <img
                  src={
                    profilePreview ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.athleteFullName || "User")}&background=random`
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={handleProfileClick}
                className="absolute bottom-1 right-1 bg-green-600 text-white p-1.5 rounded-full border-2 border-white shadow-md cursor-pointer hover:bg-green-700 transition"
              >
                <LuPencilLine size={14} />
              </button>
            </div>

            <div className="w-full sm:flex-1 space-y-2">
              <button
                onClick={handleProfileClick}
                className="w-full py-2.5 px-6 flex items-center justify-center gap-2 bg-green-600 text-center font-bold hover:bg-green-700 text-white rounded-full bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 active:translate-y-0 active:shadow-md focus:outline-none cursor-pointer text-sm"
              >
                <MdOutlineFileUpload className="h-5 w-5" />
                <span>Upload New Photo</span>
              </button>
              <p className="text-[10px] text-gray-400 text-center sm:text-left px-2">
                Recommended: Square image, max 5MB
              </p>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 mb-2">
            <h1 className="text-xl font-bold text-gray-900">Stats Update</h1>
          </div>

          {/* Bio Moved to Top */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-end">
              <Label className="text-gray-600 text-xs font-bold uppercase tracking-wider">
                Bio
              </Label>
              <span
                className={`text-[10px] ${formData.bio.length >= 100 ? "text-red-500 font-bold" : "text-gray-400"}`}
              >
                {formData.bio.length}/100
              </span>
            </div>
            <Textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              maxLength={100}
              placeholder="Tell us about yourself..."
              className={`min-h-[80px] rounded-xl border-gray-200 resize-none focus-visible:ring-green-500 text-sm placeholder:text-gray-300 ${errors.bio ? "border-red-500 ring-red-500" : ""}`}
            />
            {errors.bio && (
              <p className="text-red-500 text-[10px] mt-1 italic">
                {errors.bio}
              </p>
            )}
          </div>

          {/* Athlete Information Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-2">
              Athlete Information
            </h2>

            {/* Full Name */}
            <div className="space-y-1.5">
              <Label className="text-gray-600 text-xs font-bold uppercase tracking-wider">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  name="athleteFullName"
                  value={formData.athleteFullName}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  className="h-10 rounded-xl pl-10 border-gray-200 focus-visible:ring-green-500 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {/* Date of Birth */}
              <div className="space-y-1.5">
                <Label className="text-gray-600 text-xs font-bold uppercase tracking-wider">
                  Birthday
                </Label>
                <Input
                  type="date"
                  disabled
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  className="h-10 rounded-xl border-gray-200 bg-gray-50 text-gray-400 text-sm"
                />
              </div>

              {/* Grad year */}
              <div className="space-y-1.5">
                <Label className="text-gray-600 text-xs font-bold uppercase tracking-wider">
                  Grad year
                </Label>
                <select
                  name="gradYear"
                  value={formData.gradYear}
                  onChange={(e) => handleInputChange(e as any)}
                  className="w-full h-10 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-sm"
                >
                  {user.role === "ATHLATE"
                    ? // For 18+ Athletes: 2000 to 2025 (current year)
                      Array.from(
                        { length: new Date().getFullYear() - 2001 + 1 },
                        (_, i) => 2000 + i,
                      )
                        .reverse()
                        .map((year) => (
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
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* High School/Middle School */}
              <div className="space-y-1.5">
                <Label className="text-gray-600 text-xs font-bold uppercase tracking-wider">
                  School
                </Label>
                <Input
                  name="school"
                  value={formData.school}
                  onChange={handleInputChange}
                  placeholder="School name"
                  className="h-10 rounded-xl border-gray-200 focus-visible:ring-green-500 text-sm"
                />
              </div>

              {/* AAU Club Team */}
              <div className="space-y-1.5">
                <Label className="text-gray-600 text-xs font-bold uppercase tracking-wider">
                  AAU Team
                </Label>
                <Input
                  name="clubTeam"
                  value={formData.clubTeam}
                  onChange={handleInputChange}
                  placeholder="Team name"
                  className="h-10 rounded-xl border-gray-200 focus-visible:ring-green-500 text-sm"
                />
              </div>
            </div>

            {/* Sport & Position */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1.5">
                <Label className="text-gray-600 text-xs font-bold uppercase tracking-wider">
                  Sports
                </Label>
                <select
                  name="sports"
                  value={formData.sports}
                  onChange={(e) => handleInputChange(e as any)}
                  className="w-full h-10 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-sm"
                >
                  <option disabled value="">
                    Sports
                  </option>
                  {["Boys Basketball", "Girls Basketball"].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-gray-600 text-xs font-bold uppercase tracking-wider">
                  Position
                </Label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={(e) => handleInputChange(e as any)}
                  className="w-full h-10 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-sm"
                >
                  <option disabled value="">
                    Position
                  </option>
                  {[
                    "Point Guard",
                    "Shooting Guard",
                    "Small Forward",
                    "Power Forward",
                    "Center",
                  ].map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dominant Hand & Jersey Number */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1.5">
                <Label className="text-gray-600 text-xs font-bold uppercase tracking-wider">
                  Dominant Hand
                </Label>
                <select
                  name="dominateHand"
                  value={formData.dominateHand}
                  onChange={(e) => handleInputChange(e as any)}
                  className="w-full h-10 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-sm"
                >
                  <option disabled value="">
                    Select Hand
                  </option>
                  <option value="Right">Right</option>
                  <option value="Left">Left</option>
                  <option value="Both">Both</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-gray-600 text-xs font-bold uppercase tracking-wider">
                  Jersey Number
                </Label>
                <Input
                  name="jerseyNumber"
                  type="number"
                  value={formData.jerseyNumber}
                  onChange={handleInputChange}
                  placeholder="e.g. 23"
                  className="h-10 rounded-xl border-gray-200 focus-visible:ring-green-500 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* GPA */}
              <div className="space-y-1.5">
                <Label className="text-gray-600 text-xs font-bold uppercase tracking-wider">
                  GPA
                </Label>
                <Input
                  name="gpa"
                  value={formData.gpa}
                  onChange={handleInputChange}
                  placeholder="e.g. 3.8"
                  className="h-10 rounded-xl border-gray-200 focus-visible:ring-green-500 text-sm"
                />
              </div>

              {/* Weight */}
              <div className="space-y-1.5">
                <Label className="text-gray-600 text-xs font-bold uppercase tracking-wider">
                  Weight (lbs)
                </Label>
                <Input
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  placeholder="lbs"
                  className="h-10 rounded-xl border-gray-200 focus-visible:ring-green-500 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {/* Height */}
              <div className="space-y-1.5">
                <Label className="text-gray-600 text-xs font-bold uppercase tracking-wider">
                  Height
                </Label>
                <select
                  name="height"
                  value={formData.height}
                  onChange={(e) => handleInputChange(e as any)}
                  className="w-full h-10 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-sm"
                >
                  <option value="">Height</option>
                  {Array.from({ length: 37 }, (_, i) => {
                    const totalInches = 49 + i;
                    const feet = Math.floor(totalInches / 12);
                    const inches = totalInches % 12;
                    return (
                      <option key={totalInches} value={totalInches.toString()}>
                        {feet}'{inches}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* State */}
              <div className="space-y-1.5">
                <Label className="text-gray-600 text-xs font-bold uppercase tracking-wider">
                  State
                </Label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange(e as any)}
                  className="w-full h-10 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-sm"
                >
                  <option value="">State</option>
                  {usStates.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-2">
              Stats Update
            </h2>
          </div>

          {/* Stats Grid Reordered */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div className="space-y-1.5">
                <Label className="text-gray-600 text-xs font-bold uppercase tracking-wider text-center block sm:text-left">
                  PPG
                </Label>
                <Input
                  name="ppg"
                  value={formData.ppg}
                  onChange={handleInputChange}
                  placeholder="PPG"
                  className="h-10 rounded-xl border-gray-200 focus-visible:ring-green-500 text-sm text-center sm:text-left"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-gray-600 text-xs font-bold uppercase tracking-wider text-center block sm:text-left">
                  RPG
                </Label>
                <Input
                  name="rpg"
                  value={formData.rpg}
                  onChange={handleInputChange}
                  placeholder="RPG"
                  className="h-10 rounded-xl border-gray-200 focus-visible:ring-green-500 text-sm text-center sm:text-left"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-gray-600 text-xs font-bold uppercase tracking-wider text-center block sm:text-left">
                  BPG
                </Label>
                <Input
                  name="bpg"
                  value={formData.bpg}
                  onChange={handleInputChange}
                  placeholder="BPG"
                  className="h-10 rounded-xl border-gray-200 focus-visible:ring-green-500 text-sm text-center sm:text-left"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-gray-600 text-xs font-bold uppercase tracking-wider text-center block sm:text-left">
                  APG
                </Label>
                <Input
                  name="apg"
                  value={formData.apg}
                  onChange={handleInputChange}
                  placeholder="APG"
                  className="h-10 rounded-xl border-gray-200 focus-visible:ring-green-500 text-sm text-center sm:text-left"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-gray-600 text-xs font-bold uppercase tracking-wider text-center block sm:text-left">
                  SPG
                </Label>
                <Input
                  name="spg"
                  value={formData.spg}
                  onChange={handleInputChange}
                  placeholder="SPG"
                  className="h-10 rounded-xl border-gray-200 focus-visible:ring-green-500 text-sm text-center sm:text-left"
                />
              </div>
            </div>
          </div>

          {/* Parent Information Section */}
          {user?.role !== "ATHLATE" && (
            <div className="space-y-4">
              <div className="border-t border-gray-100 pt-4">
                <h2 className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-2">
                  Parent Information
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <Label className="text-gray-600 text-xs font-bold uppercase tracking-wider">
                    Parent Name
                  </Label>
                  <Input
                    name="parentName"
                    value={formData.parentName}
                    onChange={handleInputChange}
                    placeholder="Enter parent name (optional)"
                    className="h-10 rounded-xl border-gray-200 focus-visible:ring-green-500 text-sm"
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-1.5">
                  <Label className="text-gray-600 text-xs font-bold uppercase tracking-wider">
                    Phone Number
                  </Label>
                  <Input
                    name="phoneNumber"
                    type="tel"
                    placeholder="e.g. 1234567890 (optional)"
                    maxLength={10}
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="h-10 rounded-xl border-gray-200 focus-visible:ring-green-500 text-sm"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Footer with Buttons */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] text-white font-medium rounded-full shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 active:translate-y-0 active:shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
