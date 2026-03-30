import Home from "@/components/Home/Home/Home";
// import OverviewCard from "@/components/Home/Home/OverviewCard";

const HomePage = () => {
  return (
    <div className=" space-y-6">
      {/* <div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Overview</h1>
          <p className="text-sm text-gray-800 mt-1 font-semibold">
            Welcome to HIGHLIGHTZ
          </p>
        </div>
      </div>
      <OverviewCard /> */}
      <Home />
    </div>
  );
};

export default HomePage;
