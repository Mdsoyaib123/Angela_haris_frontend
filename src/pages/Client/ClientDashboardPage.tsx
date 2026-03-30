import Dashboard from "@/components/ClientDashboard/Dashboard/Dashboard";
import UserTransactions from "@/components/ClientDashboard/UserSubscription/UserTransactions";

const ClientDashboardPage = () => {
  return (
    <div className="space-y-6">
      <Dashboard />
      <UserTransactions />
    </div>
  );
};

export default ClientDashboardPage;
