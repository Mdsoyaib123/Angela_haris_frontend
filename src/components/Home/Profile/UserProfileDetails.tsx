import ProfileDetailPage from "./ProfileDetailPage";
import UserProfileTab from "./UserProfileTab";

export default function UserProfileDetails() {
  return (
    <div className="space-y-6 container mx-auto my-6 sm:my-10 p-2 sm:p-0">
      <ProfileDetailPage />
      <UserProfileTab />
    </div>
  );
}
