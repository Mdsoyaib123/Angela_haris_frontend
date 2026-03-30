const stats = [
  { label: "Points Per Game (PPG)", value: "1.99%" },
  { label: "Rebounds Per Game (RPG)", value: "4.00%" },
  { label: "Blocks Per Game (BPG)", value: "50%" },
  { label: "Assists Per Game (APG)", value: "9.99%" },
  { label: "Steals Per Game (SPG)", value: "12.24%" },
];

const OverviewCard = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
      {stats.map((item, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-5"
        >
          <p className="text-base font-semibold text-gray-500 mb-6">
            {item.label}
          </p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default OverviewCard;
