import ChangesPassword from "@/components/ClientDashboard/UserSettings/ChangesPassword";
// import ConnectedAccounts from "@/components/ClientDashboard/UserSettings/ConnectedAccounts";
import RecentLoginHistory from "@/components/ClientDashboard/UserSettings/RecentLoginHistory";
import SecurityAccess from "@/components/ClientDashboard/UserSettings/SecurityAccess";
// import UserSettings from "@/components/ClientDashboard/UserSettings/UserSettings";

const UserSettingsPages = () => {
  return (
    <div className=" space-y-6">
      {/* <UserSettings /> */}
      <ChangesPassword />
      <SecurityAccess />
      {/* <ConnectedAccounts /> */}
      <RecentLoginHistory />
    </div>
  );
};

export default UserSettingsPages;
