import StatsCard from "./StatsCard";
import PlatformEngagementChart from "./PlatformEngagementChart";
// import DashboardCard from "@/components/ClientDashboard/Dashboard/DashboardCard";

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      {/* <div>
        <DashboardCard />
      </div>
      <div className=" w-full rounded-2xl p-5 bg-[#FEF7ED] space-y-4">
        <h1 className="text-[#F3AA4B] font-lora text-[20px] font-semibold leading-[28px] flex justify-start gap-2 items-center">
          <span>
           
          </span>{" "}
          HIPAA Compliance Reminder
        </h1>

        <p className="text-black text-base">
          HIPAA requires all charting data to be signed wlthin 24 hours. Check
          Pending Signatures immediately. All access is logged and monitored for
          audit compliance.
        </p>
      </div> */}

      <StatsCard />
      <PlatformEngagementChart />
    </div>
  );
};

export default AdminDashboard;
