
const PostCardSkeleton = () => {
  return (
    <div className="w-full bg-white md:bg-transparent rounded-2xl md:rounded-lg overflow-hidden flex flex-col md:flex-row transition-all duration-300 shadow-sm md:shadow-none border border-gray-100 md:border-none p-2 animate-pulse">
      {/* Left Image Placeholder */}
      <div className="w-full md:w-48 aspect-square sm:aspect-video md:aspect-auto bg-gray-200 rounded-t-2xl md:rounded-l-2xl md:rounded-t-none" />

      {/* Right Content Placeholder */}
      <div className="flex-1 min-w-0 flex flex-col bg-white md:ml-4 rounded-b-2xl md:rounded-2xl p-4 space-y-4">
        {/* Header Placeholder */}
        <div className="flex items-center justify-between border-b border-gray-50 pb-2 bg-gray-50/30">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-10 h-10 sm:w-13.5 sm:h-13.5 rounded-full bg-gray-200" />
            {/* Username & Time */}
            <div className="flex flex-col gap-1.5">
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-3 w-20 bg-gray-200 rounded" />
            </div>
          </div>
        </div>

        {/* Content Body Placeholder */}
        <div className="flex-1 space-y-3">
          {/* Likes & Time */}
          <div className="flex justify-between items-center">
            <div className="h-4 w-16 bg-gray-200 rounded" />
            <div className="h-3 w-12 bg-gray-200 rounded" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="h-3 w-full bg-gray-200 rounded" />
            <div className="h-3 w-full bg-gray-200 rounded" />
            <div className="h-3 w-2/3 bg-gray-200 rounded" />
          </div>
        </div>

        {/* Actions Bar Placeholder */}
        <div className="flex items-center gap-4 pt-2 border-t border-gray-50">
          <div className="h-6 w-10 bg-gray-200 rounded" />
          <div className="ml-auto flex gap-4">
            <div className="h-8 w-8 bg-gray-200 rounded-full" />
            <div className="h-8 w-8 bg-gray-200 rounded-full" />
            <div className="h-8 w-8 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCardSkeleton;
