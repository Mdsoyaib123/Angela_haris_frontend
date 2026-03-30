import { ImageIcon, VideoIcon, X, Send, Zap, Upload, Save } from "lucide-react";
// import placeholderImg from "@/assets/photo/user.png";
import { useRef, useState } from "react";
import { useCreatePostMutation } from "@/redux/features/post/postApi";
import { useMergeVideosMutation } from "@/redux/features/reels/reelsApi";
import { useGetCurrentUserQuery } from "@/redux/features/profile/profileApi";
import { toast } from "sonner";
import UpgradeModal from "@/components/Shared/UpgradeModal";
import { useDispatch } from "react-redux";
import { triggerFeedRefresh } from "@/redux/features/feed/feedSlice";

type Mode = "photo" | "video";

interface MediaPreview {
  file: File;
  url: string;
}

export default function WhatsOnYourMind() {
  const dispatch = useDispatch();
  /* ─── current user ─── */
  const { data: currentUserData, isLoading: isUserLoading } =
    useGetCurrentUserQuery();
  const currentUser = currentUserData?.data?.user;

  /* ─── subscription ─── */
  const isPremium =
    currentUser?.subscribeStatus !== "FREE" && !!currentUser?.subscribeStatus;

  /* ─── mutations ─── */
  const [createPost, { isLoading: isPosting }] = useCreatePostMutation();
  const [mergeVideos, { isLoading: isMerging }] = useMergeVideosMutation();
  const isLoading = isPosting || isMerging;

  /* ─── ui state ─── */
  const [expanded, setExpanded] = useState(false);
  const [mode, setMode] = useState<Mode>("photo");
  const [caption, setCaption] = useState("");
  const [mediaItems, setMediaItems] = useState<MediaPreview[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const MAX_FREE_CLIPS = 3;
  const MAX_PRO_CLIPS = 6;
  const maxFiles =
    mode === "photo" ? 10 : isPremium ? MAX_PRO_CLIPS : MAX_FREE_CLIPS;
  const isDisabled = isUserLoading || isLoading;

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
  const openExpanded = () => {
    setExpanded(true);
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  const handleOpenPicker = (m: Mode) => {
    setExpanded(true);
    setMode(m);
    setTimeout(() => {
      if (m === "photo") photoInputRef.current?.click();
      else videoInputRef.current?.click();
    }, 50);
  };

  const handleFilesSelected = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setError(null);
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    if (
      mode === "video" &&
      !isPremium &&
      mediaItems.length + files.length > MAX_FREE_CLIPS
    ) {
      setShowUpgradeModal(true);
      e.target.value = "";
      return;
    }

    const remaining = maxFiles - mediaItems.length;
    const toAdd = files.slice(0, remaining);
    if (files.length > remaining)
      toast.warning(
        `Max ${maxFiles} ${mode === "photo" ? "images" : "videos"} — only first ${remaining} added.`,
      );

    const validFiles: File[] = [];
    let hasDurationError = false;
    if (mode === "video") {
      for (const file of toAdd) {
        const duration = await getVideoDuration(file);
        if (duration > 15) {
          hasDurationError = true;
        } else {
          validFiles.push(file);
        }
      }
    } else {
      validFiles.push(...toAdd);
    }

    if (hasDurationError) {
      setError("Video must be no longer than 15 seconds.");
    }

    if (validFiles.length === 0 && toAdd.length > 0 && mode === "video") {
      e.target.value = "";
      return;
    }

    const previews: MediaPreview[] = validFiles.map((file) => ({
      file,
      url: file.type.startsWith("image/") ? URL.createObjectURL(file) : "",
    }));
    setMediaItems((prev) => [...prev, ...previews]);
    e.target.value = "";
  };

  const removeItem = (i: number) => {
    setMediaItems((prev) => {
      const copy = [...prev];
      if (copy[i].url) URL.revokeObjectURL(copy[i].url);
      copy.splice(i, 1);
      return copy;
    });
  };

  const clearAll = () => {
    mediaItems.forEach((m) => {
      if (m.url) URL.revokeObjectURL(m.url);
    });
    setMediaItems([]);
    setCaption("");
    setError(null);
  };

  const handleDiscard = () => {
    clearAll();
    setMode("photo");
    setExpanded(false);
  };

  const handleSubmit = async () => {
    if (!caption.trim()) {
      toast.error("Please write something to post");
      return;
    }

    if (mediaItems.length === 0) {
      toast.error(
        `Add at least one ${mode === "photo" ? "photo" : "video clip"}`,
      );
      return;
    }
    try {
      if (mode === "photo") {
        const formData = new FormData();
        formData.append("caption", caption.trim());
        mediaItems.forEach((m) => formData.append("images", m.file));
        await createPost(formData).unwrap();
        dispatch(triggerFeedRefresh());
        toast.success("Post shared!");
        clearAll();
        setExpanded(false);
      } else {
        await mergeVideos({
          caption: "", // Caption empty as requested
          description: caption.trim(), // Using the unified text as description
          clips: mediaItems.map((m) => m.file),
        }).unwrap();
        dispatch(triggerFeedRefresh());
        toast.success("Reel created!");
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          clearAll();
          setExpanded(false);
        }, 2000);
      }
    } catch {
      toast.error(
        `Failed to ${mode === "photo" ? "post" : "create reel"}. Try again.`,
      );
    }
  };

  const MAX_VISIBLE = 4;

  // const avatarUrl = currentUser?.imgUrl || placeholderImg;
  const userName = currentUser?.athleteFullName || "You";

  /* ═══════════════════════════════════ RENDER ═══════════════════════════════════ */
  return (
    <>
      {/* Hidden file inputs */}
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFilesSelected}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        multiple
        className="hidden"
        onChange={handleFilesSelected}
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Composer is now always visible to both free and pro users */}

        {/* ══ Composer ══ */}
        {!isUserLoading && (
          <>
            {/* ── Collapsed trigger row ── */}
            {!expanded && (
              <div className="flex items-center gap-3 px-4 py-3">
                <img
                  src={
                    currentUser?.imgUrl ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.athleteFullName || "User")}&background=random`
                  }
                  alt={userName}
                  className="w-10 h-10 rounded-full object-cover shrink-0 border border-gray-200"
                />
                <button
                  onClick={openExpanded}
                  className="flex-1 text-left px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-500 transition cursor-pointer"
                >
                  {`Share
highlights, stats, awards, or training updates for coaches to see`}
                </button>
              </div>
            )}

            {/* ── Expanded composer ── */}
            {expanded && (
              <div>
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                    {mode === "photo"
                      ? "Post an Athlete Update"
                      : "Post an Athlete Update"}
                  </h3>
                  <button
                    onClick={handleDiscard}
                    className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 cursor-pointer transition"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Author row */}
                <div className="flex items-center gap-3 px-4 pt-3">
                  <img
                    src={
                      currentUser?.imgUrl ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.athleteFullName || "User")}&background=random`
                    }
                    alt={userName}
                    className="w-10 h-10 rounded-full object-cover shrink-0 border border-gray-200"
                  />
                  <div>
                    <p className="font-semibold text-sm text-gray-800">
                      {userName}
                    </p>
                    <span className="text-xs text-gray-400">
                      {mode === "photo" ? "Photo post" : "Reel · Video clips"}
                    </span>
                  </div>
                </div>

                {/* Unified Textarea for both modes */}
                <div className="px-4 pt-3">
                  <textarea
                    ref={textareaRef}
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Share highlights, stats, awards, or training updates for coaches to see"
                    disabled={isDisabled}
                    rows={3}
                    className="w-full resize-none text-gray-700 text-sm sm:text-base placeholder-gray-400 outline-none bg-transparent disabled:opacity-50"
                  />
                </div>

                {/* Inline Error Message */}
                {error && (
                  <div className="px-4 pb-2">
                    <p className="text-xs font-medium text-red-500 bg-red-50 border border-red-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                      <Zap size={12} fill="currentColor" />
                      {error}
                    </p>
                  </div>
                )}

                {/* Video description field removed as it's now unified with 'What's on your mind?' */}

                {/* Media thumbnails — compact strip */}
                {mediaItems.length > 0 && (
                  <div className="flex flex-wrap gap-2 px-4 pb-2">
                    {mediaItems.slice(0, MAX_VISIBLE).map((item, i) => (
                      <div
                        key={i}
                        className="relative group w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0"
                      >
                        {item.url ? (
                          <img
                            src={item.url}
                            alt={`preview-${i}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-1 bg-gray-800">
                            <VideoIcon size={18} className="text-white" />
                            <span className="text-[9px] text-gray-300 text-center px-1 leading-tight w-full truncate">
                              {item.file.name.length > 10
                                ? item.file.name.slice(0, 9) + "…"
                                : item.file.name}
                            </span>
                          </div>
                        )}
                        {/* +N overlay on last visible tile */}
                        {i === MAX_VISIBLE - 1 &&
                          mediaItems.length > MAX_VISIBLE && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <span className="text-white text-sm font-bold">
                                +{mediaItems.length - MAX_VISIBLE}
                              </span>
                            </div>
                          )}
                        <button
                          onClick={() => removeItem(i)}
                          className="absolute top-1 right-1 bg-black/50 hover:bg-black/80 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition cursor-pointer"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add more pill */}
                {mediaItems.length > 0 && mediaItems.length < maxFiles && (
                  <div className="px-4 pb-2">
                    <button
                      onClick={() =>
                        mode === "photo"
                          ? photoInputRef.current?.click()
                          : videoInputRef.current?.click()
                      }
                      disabled={isDisabled}
                      className="flex items-center gap-1.5 text-xs text-green-600 hover:text-green-700 font-medium cursor-pointer disabled:opacity-50"
                    >
                      <span className="text-base leading-none">+</span>
                      Add more {mode === "photo" ? "photos" : "clips"} (
                      {mediaItems.length}/{maxFiles})
                    </button>
                  </div>
                )}

                {/* Divider */}
                <div className="mx-4 border-t border-gray-100 my-2" />

                {/* Action bar */}
                <div className="flex items-center justify-between px-4 pb-3 gap-2">
                  <div className="flex items-center gap-1">
                    {/* Photo button */}
                    <button
                      onClick={() => handleOpenPicker("photo")}
                      disabled={isDisabled && mode !== "photo"}
                      title="Add photos"
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition ${mode === "photo" ? "bg-green-50 text-green-700" : "hover:bg-gray-100 text-gray-600"} disabled:opacity-40`}
                    >
                      <ImageIcon size={16} className="text-green-500" />
                      <span className="hidden sm:inline">Photo</span>
                    </button>

                    {/* Video button */}
                    <button
                      onClick={() => handleOpenPicker("video")}
                      disabled={isDisabled && mode !== "video"}
                      title="Add video clips / reel"
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition ${mode === "video" ? "bg-green-50 text-green-700" : "hover:bg-gray-100 text-gray-600"} disabled:opacity-40`}
                    >
                      <VideoIcon size={16} className="text-green-500" />
                      <span className="hidden sm:inline">Video / Reel</span>
                    </button>

                    {/* Emoji (decorative) */}
                    {/* <button
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-default hover:bg-gray-100 text-gray-600 transition"
                  disabled
                  title="Emoji (coming soon)"
                >
                  <Smile size={16} className="text-yellow-400" />
                  <span className="hidden sm:inline">Feeling</span>
                </button> */}
                  </div>

                  {/* Post button */}
                  <button
                    onClick={handleSubmit}
                    disabled={
                      isDisabled || !caption.trim() || mediaItems.length === 0
                    }
                    className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold text-white bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] shadow-sm hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send size={14} />
                    )}
                    {isLoading ? "Posting…" : "Post"}
                  </button>
                </div>
              </div>
            )}

            {/* ── Bottom shortcuts (always visible when collapsed) ── */}
            {!expanded && (
              <>
                <div className="mx-4 border-t border-gray-100" />
                <div className="flex items-center divide-x divide-gray-100 px-2 py-1">
                  <button
                    onClick={() => handleOpenPicker("photo")}
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs sm:text-sm font-medium text-gray-600 hover:bg-gray-50 cursor-pointer transition disabled:opacity-40"
                  >
                    <ImageIcon size={18} className="text-green-500" />
                    <span>Photo</span>
                  </button>
                  <button
                    onClick={() => handleOpenPicker("video")}
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs sm:text-sm font-medium text-gray-600 hover:bg-gray-50 cursor-pointer transition disabled:opacity-40"
                  >
                    <VideoIcon size={18} className="text-green-500" />
                    <span>Video / Reel</span>
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        title="Limit Reached"
        description="You've reached the 3 clip limit for reels. Upgrade to Pro to merge up to 6 clips and access premium features."
        cancelText="Continue with 3 clips"
      />

      {/* Premium Loading & Success Overlay */}
      {mode === "video" && (isLoading || isSuccess) && (
        <div className="fixed inset-0 z-110 flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
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
    </>
  );
}
