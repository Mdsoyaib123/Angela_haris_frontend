import { useState, useRef, ChangeEvent, DragEvent } from "react";
import { Upload, Plus, Save, Zap, Crown, ChevronRight, X } from "lucide-react";
import UpgradeModal from "@/components/Shared/UpgradeModal";
import { Button } from "@/components/ui/button";
import { useMergeVideosMutation } from "@/redux/features/reels/reelsApi";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import { useAuthMeQuery } from "@/redux/features/auth/authApi";

export default function ReelCreator() {
  const [mergeVideos, { isLoading, error }] = useMergeVideosMutation();

  const [caption, setCaption] = useState("");
  const [description, setDescription] = useState("");
  const [videoSlots, setVideoSlots] = useState<(File | null)[]>([null]);
  const [slotErrors, setSlotErrors] = useState<(string | null)[]>([null]);
  const { data: user } = useAuthMeQuery();

  const planStatus = user?.data.user.subscribeStatus;
  const isPremium = planStatus !== "FREE" && !!planStatus;
  console.log("Plan Status:", planStatus);

  // Merge Validation Logic (Clips per Reel)
  const MAX_FREE_CLIPS = 3;
  const MAX_PRO_CLIPS = 6;

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const activeClipsCount = videoSlots.length;

  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const navigate = useNavigate();

  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };
      video.src = URL.createObjectURL(file);
    });
  };

  const handleFileChange =
    (index: number) => async (event: ChangeEvent<HTMLInputElement>) => {
      setSlotErrors((prev) => {
        const copy = [...prev];
        copy[index] = null;
        return copy;
      });
      const file = event.target.files?.[0];
      if (file) {
        const duration = await getVideoDuration(file);
        if (duration > 15) {
          setSlotErrors((prev) => {
            const copy = [...prev];
            copy[index] = "Max 15 seconds";
            return copy;
          });
          if (fileInputRefs.current[index]) {
            fileInputRefs.current[index]!.value = "";
          }
          return;
        }
        const updatedSlots = [...videoSlots];
        updatedSlots[index] = file;
        setVideoSlots(updatedSlots);
      }
    };

  const handleRemoveFile = (index: number) => {
    const updatedSlots = [...videoSlots];
    updatedSlots[index] = null;
    setVideoSlots(updatedSlots);
    setSlotErrors((prev) => {
      const copy = [...prev];
      copy[index] = null;
      return copy;
    });
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index]!.value = "";
    }
  };

  const handleDeleteSlot = (index: number) => {
    if (videoSlots.length <= 1) {
      handleRemoveFile(index); // Minimum 2 slots, just clear if at min
      return;
    }
    setVideoSlots((prev) => prev.filter((_, i) => i !== index));
    setSlotErrors((prev) => prev.filter((_, i) => i !== index));
    // Also need to adjust refs or rely on re-renders for multi-file refs
  };

  const handleAddSlot = () => {
    if (!isPremium && videoSlots.length >= MAX_FREE_CLIPS) {
      setShowUpgradeModal(true);
      return;
    }

    if (videoSlots.length < MAX_PRO_CLIPS) {
      setVideoSlots([...videoSlots, null]);
      setSlotErrors([...slotErrors, null]);
    } else {
      toast.error(`Maximum limit of ${MAX_PRO_CLIPS} clips reached`);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop =
    (index: number) => async (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith("video/")) {
        setSlotErrors((prev) => {
          const copy = [...prev];
          copy[index] = null;
          return copy;
        });
        const duration = await getVideoDuration(file);
        if (duration > 15) {
          setSlotErrors((prev) => {
            const copy = [...prev];
            copy[index] = "Max 15 seconds";
            return copy;
          });
          return;
        }
        const updatedSlots = [...videoSlots];
        updatedSlots[index] = file;
        setVideoSlots(updatedSlots);
      }
    };

  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!caption.trim()) {
      toast.error("Caption is required");
      return;
    }
    if (!description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (videoSlots.some((slot) => slot === null)) {
      toast.error("Please fill all video slots");
      return;
    }

    try {
      const result = await mergeVideos({
        caption,
        description,
        clips: videoSlots as File[],
      }).unwrap();

      console.log("Success:", result);
      setIsSuccess(true);
      toast.success("Reels created successfully!");

      // Wait 2 seconds for user to see success state
      setTimeout(() => {
        // Reset form
        setCaption("");
        setDescription("");
        setVideoSlots([null, null, null]);
        setIsSuccess(false);

        // Redirect to home page
        navigate("/profile");
      }, 2000);
    } catch (err) {
      toast.error("Failed to create videos");
      console.error("Failed to create videos:", err);
    }
  };

  return (
    <div className="lg:pt-6 pt-2 relative">
      {/* Eye-catching Loading & Success Overlay */}
      {(isLoading || isSuccess) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative flex flex-col items-center">
            {/* Outer pulsating ring */}
            <div
              className={`absolute w-32 h-32 rounded-full animate-ping opacity-20 ${isSuccess ? "bg-green-400" : "bg-green-500"}`}
            ></div>

            {/* Main loader container */}
            <div className="relative w-24 h-24 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden group">
              {!isSuccess && (
                <>
                  <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0deg,#11D000_180deg,transparent_360deg)] animate-[spin_2s_linear_infinite] opacity-40"></div>
                  <div className="absolute inset-[2px] bg-gray-900 rounded-[22px]"></div>
                </>
              )}

              {/* Central icon with animation */}
              <div className="relative z-10 flex flex-col items-center">
                {isSuccess ? (
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                    <Save className="w-6 h-6 text-white" />
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-green-500 animate-bounce mb-1" />
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce"></span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Text labels */}
            <div className="mt-8 text-center space-y-2">
              <h3 className="text-xl font-bold text-white tracking-tight">
                {isSuccess ? "Reel Ready!" : "Creating Your Reel"}
              </h3>
              <p className="text-gray-300 text-sm animate-pulse max-w-[200px]">
                {isSuccess
                  ? "Your highlight has been successfully merged."
                  : "Merging clips and processing high-quality transitions..."}
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="border-b border-gray-100 pb-2 lg:pb-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              REEL CREATOR
            </h1>
            <p className="text-gray-500 text-sm sm:text-base font-medium leading-relaxed">
              Combine multiple clips (max 15s each) into a professional
              highlight
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {!isPremium ? (
              <div className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-50 text-blue-700 rounded-xl sm:rounded-2xl border border-blue-100 animate-in fade-in duration-500">
                <Zap size={14} className="sm:w-4 sm:h-4" fill="currentColor" />
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-nowrap">
                  Starter Tier
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-[linear-gradient(135deg,#11D000_0%,#0C5302_100%)] text-white rounded-xl sm:rounded-2xl shadow-lg animate-in fade-in duration-500">
                <Crown
                  size={14}
                  className="sm:w-4 sm:h-4"
                  fill="currentColor"
                />
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-nowrap">
                  Pro Tier
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className=" lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[380px,1fr] gap-8 items-start">
          {/* Left Column - Meta & Form */}
          <div className="space-y-8">
            {/* Simplified Plan Usage Status */}
            <div className="p-4 sm:p-6 flex flex-col bg-white rounded-2xl border border-gray-100 transition-all gap-4 sm:gap-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-inner shrink-0 ${isPremium ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600"}`}
                  >
                    {isPremium ? (
                      <Crown className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest leading-tight">
                      CAPACITY
                    </h3>
                    <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                      {isPremium ? "Pro Tier" : "Starter Tier"}
                    </p>
                  </div>
                </div>

                {!isPremium && (
                  <Link
                    to="/user-dashboard/subscription"
                    className="flex items-center justify-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-900 text-white rounded-xl text-[10px] sm:text-xs font-bold hover:bg-black transition-all hover:-translate-y-0.5"
                  >
                    Upgrade
                    <ChevronRight
                      size={12}
                      className="sm:w-[14px] sm:h-[14px] group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Usage Limit
                  </span>
                  <span
                    className={`text-[11px] sm:text-xs font-black ${activeClipsCount >= (isPremium ? MAX_PRO_CLIPS : MAX_FREE_CLIPS) ? "text-green-600" : "text-green-600"}`}
                  >
                    {activeClipsCount} /{" "}
                    {isPremium ? MAX_PRO_CLIPS : MAX_FREE_CLIPS}{" "}
                    <span className="text-gray-300 font-bold ml-0.5 uppercase">
                      Clips
                    </span>
                  </span>
                </div>
                <div className="w-full h-2 sm:h-2 bg-gray-50 rounded-full overflow-hidden border border-gray-100 shadow-inner">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${activeClipsCount >= (isPremium ? MAX_PRO_CLIPS : MAX_FREE_CLIPS) ? "bg-green-500" : "bg-green-600"}`}
                    style={{
                      width: `${Math.min((activeClipsCount / (isPremium ? MAX_PRO_CLIPS : MAX_FREE_CLIPS)) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Form Fields Card */}
            <div className="p-4 lg:p-6 bg-white rounded-2xl border border-gray-100  space-y-4 lg:space-y-6">
              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Enter a catchy caption..."
                  className="w-full px-3 py-2.5 border border-gray-100 rounded-xl bg-gray-50/50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell us more about this reel..."
                  rows={3}
                  className="w-full px-3 py-2.5 border border-gray-100 rounded-xl bg-gray-50/50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all resize-none font-medium"
                  required
                />
              </div>
            </div>

            {/* Error display */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-medium flex items-center gap-2">
                <Zap size={14} fill="currentColor" />
                {"An error occurred"}
              </div>
            )}
          </div>

          {/* Right Column - Video Upload Slots */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center order-2 justify-between mb-2">
              <h2 className="text-[10px] sm:text-[11px] font-black text-gray-400 uppercase tracking-widest">
                Video Clips ({activeClipsCount} /{" "}
                {isPremium ? MAX_PRO_CLIPS : MAX_FREE_CLIPS})
              </h2>
              {videoSlots.length < MAX_PRO_CLIPS && (
                <button
                  onClick={handleAddSlot}
                  className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-green-600 hover:text-green-700 transition-colors cursor-pointer px-2.5 py-1 sm:px-3 sm:py-1 bg-green-50 rounded-lg border border-green-100"
                >
                  <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Add Clips
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 order-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {videoSlots.map((file, index) => (
                <div
                  key={index}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop(index)}
                >
                  <div
                    className={`border-2 border-dashed rounded-[24px] p-4 sm:p-5 flex flex-col items-center justify-center min-h-[140px] sm:min-h-[160px] transition-all relative group ${slotErrors[index] ? "border-red-500 bg-red-50/5" : "border-gray-200 hover:border-green-400/50 hover:bg-green-50/5"}`}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        file ? handleRemoveFile(index) : handleDeleteSlot(index)
                      }
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm text-gray-400 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 z-10 shadow-sm"
                      title={file ? "Remove file" : "Remove slot"}
                    >
                      <X size={14} />
                    </button>
                    <input
                      ref={(el) => {
                        fileInputRefs.current[index] = el;
                      }}
                      type="file"
                      onChange={handleFileChange(index)}
                      accept="video/*"
                      className="hidden"
                    />

                    {file ? (
                      <div className="text-center w-full px-2">
                        <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full mb-3 sm:mb-4">
                          <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-900 font-bold mb-1 truncate max-w-full">
                          {file.name}
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-500 mb-3 sm:mb-4">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <div className="flex justify-center gap-4">
                          <button
                            onClick={() =>
                              fileInputRefs.current[index]?.click()
                            }
                            className="text-[10px] sm:text-xs text-blue-600 font-bold hover:text-blue-700 uppercase tracking-wider"
                          >
                            Change
                          </button>
                          <button
                            onClick={() => handleRemoveFile(index)}
                            className="text-[10px] sm:text-xs text-red-600 font-bold hover:text-red-700 uppercase tracking-wider"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="text-center cursor-pointer px-2"
                        onClick={() => fileInputRefs.current[index]?.click()}
                      >
                        <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full mb-3 sm:mb-4 shadow-sm">
                          <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                        </div>
                        <p className="text-sm sm:text-base text-gray-900 font-bold mb-1">
                          Clip {index + 1}
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-500 mb-3">
                          15s limit
                        </p>
                        <button
                          type="button"
                          className="px-4 py-1.5 sm:px-6 sm:py-2 border border-gray-200 rounded-xl text-[11px] sm:text-xs text-gray-600 font-bold hover:bg-gray-50 transition-colors"
                        >
                          Select File
                        </button>
                      </div>
                    )}

                    {/* Inline Error Text */}
                    {slotErrors[index] && (
                      <div className="absolute bottom-4 left-4 right-4 px-2 py-1.5 bg-red-600 text-white text-[9px] font-black uppercase tracking-widest rounded-lg shadow-lg flex items-center justify-center gap-1.5 animate-in fade-in zoom-in duration-200">
                        <Zap size={10} fill="currentColor" />
                        {slotErrors[index]}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Create Button - Unified at the bottom of clips */}
            <div className="order-3 pb-12">
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full h-12 sm:h-14 flex items-center justify-center rounded-xl sm:rounded-2xl text-white bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] shadow-lg shadow-green-900/10 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:brightness-110 font-black text-sm sm:text-lg uppercase tracking-widest cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                {isLoading ? "Creating highlight..." : "Create Reel"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        title="Limit Reached"
        description="You've reached the 3 clip limit for free highlights. Upgrade to Pro to merge up to 6 clips and access premium features."
        cancelText="Continue with 3 clips"
      />
    </div>
  );
}
