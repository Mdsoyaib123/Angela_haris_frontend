import { useState } from "react";
import AllContent from "./AllContent";
import ReelsContent from "./ReelsContent";
import ImageContent from "./ImageContent";
import { LuGrid3X3 } from "react-icons/lu";
import { IoPlayOutline } from "react-icons/io5";
import { CiImageOn } from "react-icons/ci";
import { useGetPostsQuery } from "@/redux/features/post/postApi";

interface TabContentProps {
  activeTab: string;
}

const TabContent = ({ activeTab }: TabContentProps) => {
  switch (activeTab) {
    case "All":
      return (
        <div>
          <AllContent />
        </div>
      );
    case "Reels":
      return (
        <div>
          <ReelsContent />
        </div>
      );
    case "Image":
      return (
        <div>
          <ImageContent />
        </div>
      );
    default:
      return null;
  }
};

// Skeleton grid component for loading state
const SkeletonPostGrid = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-2 sm:gap-4 animate-pulse">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="aspect-square bg-gray-200 rounded-lg" />
      ))}
    </div>
  );
};

const UserProfileTab = () => {
  const [activeTab, setActiveTab] = useState("All");
  const { isLoading: postsLoading } = useGetPostsQuery();

  const tabs = [
    { id: "All", label: "All", icon: <LuGrid3X3 className="h-6 w-6" /> },
    {
      id: "Reels",
      label: "Reels",
      icon: <IoPlayOutline className="h-6 w-6" />,
    },
    { id: "Image", label: "Image", icon: <CiImageOn className="h-6 w-6" /> },
  ];

  return (
    <div className="mt-8 sm:mt-18 font-sans">
      {/* Tabs (always visible) */}
      <div className="mb-2 sm:mb-3">
        <div className="flex justify-center sm:gap-2 overflow-x-auto py-1 sm:py-2 px-2 border-b border-gray-100 sm:border-none scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-2 px-3 sm:px-4 cursor-pointer whitespace-nowrap text-sm sm:text-lg font-medium 
                rounded-t-md transition-colors duration-200 shrink-0 flex gap-2 justify-center items-center
                ${
                  activeTab === tab.id
                    ? "text-[#262626] border-b-2 border-green-600 font-bold"
                    : "text-[#8E8E8E] hover:text-[#262626]"
                }
              `}
            >
              <span className="sm:hidden scale-90">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content with skeleton loading */}
      <div className="mt-6">
        {postsLoading ? (
          <SkeletonPostGrid />
        ) : (
          <TabContent activeTab={activeTab} />
        )}
      </div>
    </div>
  );
};

export default UserProfileTab;
