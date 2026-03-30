// ProfileDataCard.tsx
interface ProfileDataCardProps {
  stats: {
    ppg?: number | null;
    apg?: number | null;
    spg?: number | null;
    blk?: number | null;
    rpg?: number | null;
  };
}

const ProfileDataCard = ({ stats }: ProfileDataCardProps) => {
  const items = [
    { label: "Points Per Game (PPG)", value: stats.ppg },
    { label: "Rebounds Per Game (RPG)", value: stats.rpg },
    { label: "Blocks Per Game (BPG)", value: stats.blk },
    { label: "Assists Per Game (APG)", value: stats.apg },
    { label: "Steals Per Game (SPG)", value: stats.spg },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-medium text-gray-900">Player Stats</h1>
        <p className="text-base text-gray-800 mt-1 font-medium">
          Welcome to HIGHLIGHTZ
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        {items.map((item, index) => (
          <div
            key={index}
            className={`bg-white rounded-xl shadow-sm sm:shadow-lg border border-[#E2E8F0] px-3 py-4 sm:px-6 sm:py-5
              ${index < 3 ? "col-span-1 lg:col-span-2" : "col-span-1 lg:col-span-3"}
            `}
          >
            <p className="text-[10px] sm:text-base font-semibold sm:font-medium text-gray-500 mb-2 sm:mb-6 uppercase sm:normal-case tracking-wider sm:tracking-normal">
              {item.label.includes("(") ? item.label.split("(")[0] : item.label}
              <span className="hidden sm:inline">
                {item.label.includes("(")
                  ? ` (${item.label.split("(")[1]}`
                  : ""}
              </span>
              <span className="sm:hidden block text-xs text-gray-400 mt-0.5">
                {item.label.includes("(")
                  ? item.label.split("(")[1].replace(")", "")
                  : ""}
              </span>
            </p>
            <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold sm:font-medium text-gray-900">
              {item.value !== null && item.value !== undefined
                ? `${item.value}`
                : "—"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileDataCard;
