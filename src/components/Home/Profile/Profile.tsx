import ProfileCard from "./ProfileCard";
import ProfileTab from "./ProfileTab";
import WhatsOnYourMind from "../Home/WhatsOnYourMind";

const Profile = () => {
  return (
    <div className=" space-y-6">
      <ProfileCard />
      <section className="py-2">
        <WhatsOnYourMind />
      </section>
      <ProfileTab />
    </div>
  );
};

export default Profile;
