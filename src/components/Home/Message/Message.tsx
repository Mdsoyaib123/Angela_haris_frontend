/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef, useMemo } from "react";
import { Search } from "lucide-react";
import { CgAttachment } from "react-icons/cg";
import { FiSend } from "react-icons/fi";
import { FaRegImage } from "react-icons/fa";
import { IoCheckmark } from "react-icons/io5";
import { LuClock3 } from "react-icons/lu";
import { useAuthMeQuery } from "@/redux/features/auth/authApi";
import {
  useGetChatListQuery,
  useGetMessagesQuery,
  useUploadFileMutation,
  chatApi,
} from "@/redux/features/chat/chatApi";
import { connectSocket, getSocket } from "@/utils/socket";
import { useAppDispatch } from "@/redux/hooks/redux-hook";
import { useSearchParams } from "react-router-dom";

// ─── API Types ──────────────────────────────────────────────────────────────
interface ContactInfo {
  id: string;
  athleteFullName: string;
  imgUrl: string | null;
}

interface ChatListItem {
  conversationId: string;
  contactInfo: ContactInfo;
  lastMessage: {
    id: string;
    content: string;
    createdAt: string;
  } | null;
}

interface ApiMessage {
  id: string;
  tempId?: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  conversationId?: string;
  attachments?: { fileUrl: string; fileType: string }[];
  files?: { fileUrl: string; fileType: string }[];
  status?: "sending" | "sent";
}

export default function Message() {
  const dispatch = useAppDispatch();
  const { data: userData } = useAuthMeQuery();
  const myId: string = userData?.data?.user?.id ?? "";
  const [searchParams, setSearchParams] = useSearchParams();

  const newUserId = searchParams.get("newUserId");
  const newName = searchParams.get("newName");

  const [selectedContact, setSelectedContact] = useState<ContactInfo | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);

  // Extra messages received via socket
  const [socketMessages, setSocketMessages] = useState<ApiMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [blinkingMessageId, setBlinkingMessageId] = useState<string | null>(
    null,
  );
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ─── Refs for Socket Listeners ───────────────────────────────────────────
  // Using refs to avoid effect closure issues and frequent re-registering
  const selectedContactRef = useRef<ContactInfo | null>(null);
  const myIdRef = useRef<string>(myId);

  useEffect(() => {
    selectedContactRef.current = selectedContact;
  }, [selectedContact]);
  useEffect(() => {
    myIdRef.current = myId;
  }, [myId]);

  // ✅ Use allMessages directly instead of redundant stableMessages state to avoid loops

  // ─── API Queries ─────────────────────────────────────────────────────────
  const { data: chatList = [], isLoading: listLoading } = useGetChatListQuery(
    {},
  );
  const [uploadFile] = useUploadFileMutation();

  const { data: apiMessagesData, isFetching } = useGetMessagesQuery(
    selectedContact?.id,
    { skip: !selectedContact?.id },
  );

  // Merge API messages + socket messages, deduplicated and sorted
  const allMessages = useMemo(() => {
    // 1. Get base from API
    const apiData = (apiMessagesData as any)?.data || apiMessagesData;
    const base = Array.isArray(apiData) ? (apiData as ApiMessage[]) : [];

    // 2. Combine with socket messages using a Map for deduplication by ID
    const messageMap = new Map<string, ApiMessage>();

    // Add API messages first (they are authoritative)
    base.forEach((m) => messageMap.set(m.id, m));

    // Add socket messages
    socketMessages.forEach((m) => {
      // Deduplicate: if API list already has it (by ID), skip or update
      if (!messageMap.has(m.id)) {
        // For temporary messages, check if a message with same content from me already exists in base
        if (m.id.startsWith("temp-")) {
          const isConfirmed = base.some(
            (bm) => bm.content === m.content && bm.senderId === myId,
          );
          if (!isConfirmed) messageMap.set(m.id, m);
        } else {
          messageMap.set(m.id, m);
        }
      }
    });

    // 3. Sort by createdAt to ensure correct order
    const sorted = Array.from(messageMap.values()).sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

    console.log("📊 allMessages memo recalculated:", {
      base: base.length,
      socket: socketMessages.length,
      final: sorted.length,
    });

    return sorted;
  }, [apiMessagesData, socketMessages, myId]);

  // ─── Chat List Data ──────────────────────────────────────────────────────
  const chatListData = useMemo(() => {
    return (chatList as any)?.data || chatList || [];
  }, [chatList]);

  // ─── Filtered contacts ────────────────────────────────────────────────────
  const filteredContacts = (chatListData as ChatListItem[]).filter((item) =>
    item.contactInfo.athleteFullName
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  // ─── Auto-select first contact or URL param contact ────────────────────────────
  useEffect(() => {
    const list = chatListData as ChatListItem[];

    // Check if there's a new user ID in URL to message
    if (newUserId && newName) {
      // Find them in our existing list if they're there
      const existingContactMatch = list.find(
        (c) => c.contactInfo.id === newUserId,
      );
      if (existingContactMatch) {
        setSelectedContact(existingContactMatch.contactInfo);
      } else {
        // Create a temporary local contact representation
        setSelectedContact({
          id: newUserId,
          athleteFullName: newName,
          imgUrl: null,
        });
      }

      // Clean up the URL so it doesn't persistently stay on the new message route if we refresh
      setSearchParams(new URLSearchParams());
      // we do not return here, we want it to set the contact
    } else if (list.length > 0 && !selectedContact && !newUserId) {
      setSelectedContact(list[0].contactInfo);
    }
  }, [chatListData, selectedContact, newUserId, newName, setSearchParams]);

  // ─── Socket connection ────────────────────────────────────────────────────
  useEffect(() => {
    if (!myId) return;
    const socket = connectSocket(myId);
    return () => {
      socket.disconnect();
    };
  }, [myId]);

  // ─── Socket Events ────────────────────────────────────────────────────────
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !myId) return;

    console.log("🔌 Registering Socket Listeners for myId:", myId);

    const handleNewMessage = (msg: ApiMessage) => {
      const currentContactId = selectedContactRef.current?.id;
      const currentMyId = myIdRef.current;

      // Assign a fallback ID if server sends undefined/null ID
      const effectiveId =
        msg.id || msg.tempId || `socket-${Date.now()}-${Math.random()}`;
      const finalizedMsg = { ...msg, id: effectiveId };

      console.log("📩 newMessage Received:", {
        id: effectiveId,
        sender: msg.senderId,
        content: msg.content.slice(0, 20),
      });

      // 1. Update Sidebar always (for all contacts)
      const sidebarId =
        msg.senderId === currentMyId ? msg.receiverId : msg.senderId;
      dispatch(
        chatApi.util.updateQueryData("getChatList", undefined, (draft: any) => {
          const list = draft?.data || draft;
          if (Array.isArray(list)) {
            const idx = list.findIndex((c) => c.contactInfo?.id === sidebarId);
            if (idx !== -1) {
              list[idx].lastMessage = {
                id: effectiveId,
                content: msg.content,
                createdAt: msg.createdAt,
              };
              const [item] = list.splice(idx, 1);
              list.unshift(item);
            }
          }
        }),
      );

      // 2. Update current chat if message belongs to it
      const isRelevant =
        msg.senderId === currentContactId ||
        msg.receiverId === currentContactId ||
        msg.senderId === currentMyId;

      if (isRelevant) {
        setSocketMessages((prev) => {
          // If the message has a REAL ID (not undefined), check for duplicates
          if (msg.id && prev.some((m) => m.id === msg.id)) {
            console.warn("⚠️ Duplicate message ID detected, skipping update");
            return prev;
          }

          // For messages without ID, check content + sender similarity to avoid duplicates if possible
          if (
            !msg.id &&
            prev.some(
              (m) =>
                !m.id.startsWith("temp-") &&
                m.content === msg.content &&
                m.senderId === msg.senderId,
            )
          ) {
            console.warn(
              "⚠️ Potential duplicate message content detected, skipping update",
            );
            return prev;
          }

          // Remove local optimistic copy
          const filtered = prev.filter(
            (m) =>
              !(
                m.id.startsWith("temp-") &&
                m.content === msg.content &&
                m.senderId === currentMyId
              ),
          );
          return [...filtered, finalizedMsg];
        });

        // Update RTK cache
        const cacheKey =
          msg.senderId === currentMyId ? msg.receiverId : msg.senderId;
        dispatch(
          chatApi.util.updateQueryData(
            "getMessages",
            cacheKey,
            (draft: any) => {
              const messages = draft?.data || draft;
              if (
                Array.isArray(messages) &&
                !messages.some((m) => m.id === effectiveId)
              ) {
                messages.push(finalizedMsg);
              }
            },
          ),
        );
      }
    };

    const handleMessageAcknowledged = ({ tempId }: { tempId: string }) => {
      console.log("📍 messageAcknowledged:", tempId);
      setSocketMessages((prev) => {
        // Find newest local temp message that doesn't have a server tempId yet
        const lastIdx = [...prev]
          .reverse()
          .findIndex((m) => m.id.startsWith("temp-") && !m.tempId);
        if (lastIdx === -1) {
          console.log("⚠️ No matching optimistic message for acknowledgment");
          return prev;
        }
        const idx = prev.length - 1 - lastIdx;
        const next = [...prev];
        next[idx] = { ...next[idx], tempId };
        console.log(
          "✅ Associated local message at index",
          idx,
          "with tempId:",
          tempId,
        );
        return next;
      });
    };

    const handleMessageSent = ({
      tempId,
      savedMessage,
    }: {
      tempId: string;
      savedMessage: ApiMessage;
    }) => {
      console.log("✅ messageSent (Confirmed):", {
        tempId,
        savedId: savedMessage.id,
      });
      setSocketMessages((prev) => {
        const idx = prev.findIndex(
          (m) => m.tempId === tempId || m.id === tempId,
        );
        if (idx === -1) {
          console.log(
            "ℹ️ No temp match found, fallback to content matching or new push",
          );
          const filtered = prev.filter(
            (m) =>
              !(m.id.startsWith("temp-") && m.content === savedMessage.content),
          );
          return [...filtered, { ...savedMessage, status: "sent" }];
        }
        const next = [...prev];
        next[idx] = { ...savedMessage, status: "sent" };
        console.log("✅ Replaced temp message with saved message in state");
        return next;
      });

      setBlinkingMessageId(savedMessage.id);
      setTimeout(() => setBlinkingMessageId(null), 1000);

      const contactId =
        savedMessage.senderId === myIdRef.current
          ? savedMessage.receiverId
          : savedMessage.senderId;
      dispatch(
        chatApi.util.updateQueryData("getMessages", contactId, (draft: any) => {
          const messages = draft?.data || draft;
          if (
            Array.isArray(messages) &&
            !messages.some((m) => m.id === savedMessage.id)
          ) {
            messages.push(savedMessage);
          }
        }),
      );
    };

    const handleMessageError = ({
      tempId,
      message,
    }: {
      tempId: string;
      message: string;
    }) => {
      console.error("❌ messageError:", { tempId, message });
      alert(message);
      setSocketMessages((prev) =>
        prev.filter((m) => m.tempId !== tempId && m.id !== tempId),
      );
    };

    const handleTyping = (data: { isTyping: boolean }) =>
      setIsTyping(data.isTyping);

    socket.on("newMessage", handleNewMessage);
    socket.on("messageAcknowledged", handleMessageAcknowledged);
    socket.on("messageSent", handleMessageSent);
    socket.on("messageError", handleMessageError);
    socket.on("displayTyping", handleTyping);

    return () => {
      console.log("🔌 Removing Socket Listeners");
      socket.off("newMessage", handleNewMessage);
      socket.off("messageAcknowledged", handleMessageAcknowledged);
      socket.off("messageSent", handleMessageSent);
      socket.off("messageError", handleMessageError);
      socket.off("displayTyping", handleTyping);
    };
  }, [myId, dispatch]);

  // ─── Auto-scroll ──────────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages, isTyping]);

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleSelectContact = (contact: ContactInfo) => {
    if (contact.id === selectedContact?.id) return;
    setSocketMessages([]);
    setSelectedContact(contact);
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() && !imageFile && !attachmentFile) return;
    if (!selectedContact?.id || !myId) return;

    const socket = getSocket();
    if (!socket) return;

    let filesData: { fileUrl: string; fileType: string }[] = [];

    const fileToUpload = imageFile || attachmentFile;

    if (fileToUpload) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("files", fileToUpload);
      try {
        const res = await uploadFile(formData).unwrap();
        // The server returns an array of { url, type }
        const uploadedFiles = Array.isArray(res) ? res : res?.data || [];
        if (uploadedFiles.length > 0) {
          filesData = uploadedFiles.map((f: any) => ({
            fileUrl: f.url,
            fileType: f.type,
          }));
        }
      } catch (err) {
        console.error("File upload failed", err);
        alert("Failed to upload file.");
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
    }

    const currentChat = (chatListData as ChatListItem[]).find(
      (c) => c.contactInfo.id === selectedContact.id,
    );

    const conversationId =
      currentChat?.conversationId ||
      allMessages.find((m) => m.conversationId)?.conversationId ||
      "";

    const optimisticMsg: ApiMessage = {
      id: `temp-${Date.now()}`,
      content: messageInput,
      senderId: myId,
      receiverId: selectedContact.id,
      createdAt: new Date().toISOString(),
      conversationId: conversationId,
      files: filesData,
      status: "sending",
    };

    setSocketMessages((prev) => [...prev, optimisticMsg]);

    console.log("📤 Sending message via socket:", {
      conversationId,
      receiverId: selectedContact.id,
      content: messageInput,
      files: filesData,
    });

    socket.emit("sendMessage", {
      conversationId,
      receiverId: selectedContact.id,
      content: messageInput,
      files: filesData,
    });

    setMessageInput("");
    setImageFile(null);
    setAttachmentFile(null);
    stopTyping();
  };

  const stopTyping = () => {
    const socket = getSocket();
    if (!socket || !selectedContact?.id) return;
    socket.emit("typing", { receiverId: selectedContact.id, isTyping: false });
  };

  const sendTypingStatus = () => {
    const socket = getSocket();
    if (!socket || !selectedContact?.id) return;

    socket.emit("typing", { receiverId: selectedContact.id, isTyping: true });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    } else {
      sendTypingStatus();
    }
  };

  // ─── Formatters ───────────────────────────────────────────────────────────
  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  const renderWithLinks = (text: string, isOwn: boolean) => {
    if (!text) return null;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={`underline wrap-break-word ${isOwn ? "text-white hover:text-green-100" : "text-blue-600 hover:text-blue-800"}`}
          >
            {part}
          </a>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  // ─── Skeletons ───────────────────────────────────────────────────────────
  const ContactSkeleton = () => (
    <div className="space-y-1">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-start gap-4 p-4 animate-pulse">
          <div className="w-14 h-14 rounded-full bg-neutral-100 shrink-0" />
          <div className="flex-1 pt-1">
            <div className="flex justify-between mb-2">
              <div className="h-4 bg-neutral-100 rounded w-24" />
              <div className="h-3 bg-neutral-100 rounded w-12" />
            </div>
            <div className="h-3 bg-neutral-100 rounded w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );

  const MessageSkeleton = () => (
    <div className="space-y-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"} animate-pulse`}
        >
          <div
            className={`w-2/3 h-16 rounded-[32px] bg-neutral-100 ${i % 2 === 0 ? "rounded-tl-sm" : "rounded-tr-sm"}`}
          />
        </div>
      ))}
    </div>
  );

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div
      className="w-full max-w-full mx-auto"
      style={{ height: "calc(100vh - 160px)" }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
        {/* Contacts Sidebar */}
        <div className="lg:col-span-4 bg-white rounded border border-neutral-100 overflow-hidden flex flex-col h-full">
          <div className="p-6">
            <h2 className="text-3xl font-bold text-neutral-900 mb-6 font-primary">
              Messages
            </h2>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search anything here..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-neutral-100 rounded-2xl text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all shadow-xs"
              />
            </div>
          </div>

          <div className="overflow-y-auto flex-1 px-4 pb-4">
            {listLoading ? (
              <ContactSkeleton />
            ) : filteredContacts.length === 0 ? (
              <p className="text-center text-neutral-400 text-sm py-8 font-primary">
                No conversations yet
              </p>
            ) : (
              <div className="space-y-1">
                {filteredContacts.map((item: ChatListItem) => (
                  <div
                    key={item.contactInfo.id}
                    onClick={() => handleSelectContact(item.contactInfo)}
                    className={`flex items-start gap-4 p-4 cursor-pointer transition-all duration-200 rounded-2xl group ${
                      selectedContact?.id === item.contactInfo.id
                        ? "bg-neutral-50"
                        : "hover:bg-neutral-50/50"
                    }`}
                  >
                    <div className="shrink-0">
                      <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center text-lg font-bold text-neutral-600 shadow-xs overflow-hidden border border-neutral-100">
                        {item.contactInfo.imgUrl ? (
                          <img
                            src={item.contactInfo.imgUrl}
                            alt={item.contactInfo.athleteFullName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          item.contactInfo.athleteFullName
                            .charAt(0)
                            .toUpperCase()
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-bold text-neutral-900 text-base truncate">
                          {item.contactInfo.athleteFullName}
                        </h3>
                        {item.lastMessage?.createdAt && (
                          <span className="text-[11px] text-neutral-400 font-medium">
                            {formatTime(item.lastMessage.createdAt)}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-neutral-500 truncate leading-snug">
                        {item.lastMessage?.content ?? "No messages yet"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-8 bg-white/80 backdrop-blur-sm rounded overflow-hidden border border-neutral-200/50 flex flex-col h-full">
          {selectedContact ? (
            <>
              {/* Header */}
              <div className="px-6 py-5 border-b border-neutral-100 bg-white">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-lg font-bold text-neutral-600 overflow-hidden border border-neutral-100">
                    {selectedContact.imgUrl ? (
                      <img
                        src={selectedContact.imgUrl}
                        alt={selectedContact.athleteFullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      selectedContact.athleteFullName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <h3 className="font-bold text-neutral-900 text-lg">
                    {selectedContact.athleteFullName}
                  </h3>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-white">
                {isFetching && allMessages.length === 0 ? (
                  <MessageSkeleton />
                ) : allMessages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-neutral-400 text-sm">
                      No messages yet. Say hello! 👋
                    </p>
                  </div>
                ) : (
                  allMessages.map((message) => {
                    const isOwn = message.senderId === myId;
                    const msgAttachments =
                      message.attachments || message.files || [];
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isOwn ? "justify-end" : "justify-start"} animate-fadeIn`}
                      >
                        <div
                          className={`max-w-[85%] sm:max-w-[75%] px-6 py-4 shadow-xs transition-all duration-300 ${
                            isOwn
                              ? "bg-[#00A859] text-white rounded-[32px] rounded-tr-sm"
                              : "bg-white text-neutral-900 rounded-[32px] rounded-tl-sm border border-neutral-100"
                          } ${blinkingMessageId === message.id ? "animate-confirmBlink" : ""}`}
                        >
                          {msgAttachments.map((f: any, i) => (
                            <div key={i} className="mb-2">
                              {f.fileType === "IMAGE" ? (
                                <img
                                  src={f.fileUrl}
                                  className="rounded-2xl max-w-full border border-neutral-100/10"
                                  alt="Attachment"
                                />
                              ) : (
                                <a
                                  href={f.fileUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className={`text-xs underline flex items-center gap-1 ${isOwn ? "text-green-50" : "text-blue-600"}`}
                                >
                                  📎 File {i + 1}
                                </a>
                              )}
                            </div>
                          ))}
                          <p className="text-[15px] leading-relaxed wrap-break-word font-medium">
                            {renderWithLinks(message.content, isOwn)}
                          </p>
                          <p
                            className={`text-[10px] mt-2 font-medium opacity-70 flex items-center justify-end gap-1 ${isOwn ? "text-right" : "text-left"}`}
                          >
                            {formatTime(message.createdAt)}
                            {isOwn && (
                              <span>
                                {message.status === "sending" ? (
                                  <LuClock3 className="w-2.5 h-2.5 animate-pulse" />
                                ) : (
                                  <IoCheckmark className="w-3 h-3" />
                                )}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                {isTyping && (
                  <div className="flex justify-start animate-fadeIn">
                    <div className="px-4 py-2 bg-white rounded-2xl rounded-tl-sm shadow-sm border border-neutral-200/50 text-neutral-400 text-xs italic">
                      typing...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="px-6 py-6 border-t border-neutral-100 bg-white">
                <div className="relative flex items-center gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder={
                        isUploading
                          ? "Uploading file..."
                          : "Describe what you want to see"
                      }
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={isUploading}
                      className="w-full pl-6 pr-14 py-4 bg-white border border-neutral-150 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-[15px] placeholder:text-neutral-400 font-medium disabled:bg-neutral-50 disabled:cursor-not-allowed"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <label className="p-2 hover:bg-neutral-50 rounded-full cursor-pointer text-neutral-400 transition-colors">
                        <FaRegImage className="h-5 w-5" />
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={(e) =>
                            e.target.files && setImageFile(e.target.files[0])
                          }
                        />
                      </label>
                      <label className="p-2 hover:bg-neutral-50 rounded-full cursor-pointer text-neutral-400 transition-colors">
                        <CgAttachment className="h-5 w-5" />
                        <input
                          type="file"
                          hidden
                          onChange={(e) =>
                            e.target.files &&
                            setAttachmentFile(e.target.files[0])
                          }
                        />
                      </label>
                    </div>
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={
                      (!messageInput.trim() && !imageFile && !attachmentFile) ||
                      isUploading
                    }
                    className="w-12 h-12 flex cursor-pointer items-center justify-center bg-[#00A859] hover:bg-[#008f4c] text-white rounded-full shrink-0 transition-all shadow-md active:scale-95 disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed"
                  >
                    {isUploading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <FiSend className="h-5 w-5 " />
                    )}
                  </button>
                </div>
                {/* File Previews */}
                {(imageFile || attachmentFile) && (
                  <div className="flex gap-2 mt-4 px-2 relative">
                    {imageFile && (
                      <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-bold border border-green-100">
                        <FaRegImage /> {imageFile.name.slice(0, 15)}...
                        {!isUploading && (
                          <button
                            onClick={() => setImageFile(null)}
                            className="hover:text-green-900 px-1"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    )}
                    {attachmentFile && (
                      <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-bold border border-blue-100">
                        <CgAttachment /> {attachmentFile.name.slice(0, 15)}...
                        {!isUploading && (
                          <button
                            onClick={() => setAttachmentFile(null)}
                            className="hover:text-blue-900 px-1"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    )}
                    {isUploading && (
                      <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-full">
                        <div className="w-4 h-4 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-neutral-400 text-lg">
                Select a conversation to start messaging
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes confirmBlink {
          0% { filter: brightness(1); }
          50% { filter: brightness(1.5); transform: scale(1.02); }
          100% { filter: brightness(1); transform: scale(1); }
        }
        .animate-fadeIn { animation: fadeIn 0.25s ease-out; }
        .animate-confirmBlink { animation: confirmBlink 0.5s ease-in-out; }
      `}</style>
    </div>
  );
}
