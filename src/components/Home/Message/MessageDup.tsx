import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { CgAttachment } from "react-icons/cg";
import emm2 from "@/assets/photo/user.png"; // default avatar
import { FiSend } from "react-icons/fi";
import { FaRegImage } from "react-icons/fa";
import { useAuthMeQuery } from "@/redux/features/auth/authApi";
import { connectSocket } from "@/utils/socket";
import { useGetMessagesQuery } from "@/redux/features/chat/chatApi";

interface Message {
  id: number;
  text: string;
  timestamp: string;
  isOwn: boolean;
  image?: string; // optional uploaded image
  attachment?: string; // optional uploaded file
}

interface Contact {
  id: number;
  name: string;
  avatar: string;
  online?: boolean;
}

export default function Message() {
  const { data: userData } = useAuthMeQuery();
  const { data: history = [] } = useGetMessagesQuery(userData?.data?.user?.id, {
    skip: !userData?.data?.user?.id,
  });
  console.log(history, "----------history");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);

  const contacts: Contact[] = [
    {
      id: 1,
      name: "Cristiano Ronaldo",
      avatar: emm2,
      online: true,
    },
    {
      id: 2,
      name: "Leonal Messi",
      avatar: emm2,
      online: false,
    },
  ];

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "I want to meet with you if you free next Sunday.",
      timestamp: "14/06/2025 | 2:06 PM",
      isOwn: false,
    },
    {
      id: 2,
      text: "Yes, full of free just for you. Just tell me place name?",
      timestamp: "14/06/2025 | 2:10 PM",
      isOwn: true,
    },
    {
      id: 3,
      text: "How about the coffee shop near the city park?",
      timestamp: "14/06/2025 | 2:12 PM",
      isOwn: false,
    },
    {
      id: 4,
      text: "Sounds good to me. What time should we meet?",
      timestamp: "14/06/2025 | 2:15 PM",
      isOwn: true,
    },
    {
      id: 5,
      text: "Let’s meet around 5 PM. Is that okay for you?",
      timestamp: "14/06/2025 | 2:18 PM",
      isOwn: false,
    },
    {
      id: 6,
      text: "Yes, 5 PM works perfectly for me.",
      timestamp: "14/06/2025 | 2:20 PM",
      isOwn: true,
    },
    {
      id: 7,
      text: "Great! I’ll book a table in advance.",
      timestamp: "14/06/2025 | 2:22 PM",
      isOwn: false,
    },
    {
      id: 8,
      text: "Nice, thank you. See you on Sunday then.",
      timestamp: "14/06/2025 | 2:25 PM",
      isOwn: true,
    },
  ]);

  // ✅ connect socker
  useEffect(() => {
    if (!userData?.data?.user?.id) return;

    const socket = connectSocket(userData.data.user.id);

    socket.on("connect", () => {
      console.log("✅ Connected from component:", socket.id);
    });

    return () => {
      socket.disconnect();
    };
  }, [userData?.data?.user?.id]);

  useEffect(() => {
    if (contacts.length > 0 && !selectedContact) {
      setSelectedContact(contacts[0]);
    }
  }, []);

  const handleSendMessage = () => {
    if (messageInput.trim() || imageFile || attachmentFile) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: messageInput,
        timestamp: new Date().toLocaleString("en-GB", { hour12: true }),
        isOwn: true,
        image: imageFile ? URL.createObjectURL(imageFile) : undefined,
        attachment: attachmentFile ? attachmentFile.name : undefined,
      };
      setMessages([...messages, newMessage]);
      setMessageInput("");
      setImageFile(null);
      setAttachmentFile(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="w-full max-w-full mx-auto">
      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        {/* Contacts Sidebar */}
        <div className="lg:col-span-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-neutral-200/50 overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-neutral-200/50 bg-linear-to-br from-white to-neutral-50">
            <h2 className="text-2xl font-semibold text-neutral-800 mb-4">
              Messages
            </h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-3 bg-neutral-100 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 text-sm placeholder:text-neutral-400"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            </div>
          </div>

          <div className="overflow-y-auto max-h-150">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={`flex items-center gap-3 p-4 cursor-pointer transition-all duration-200 border-b border-neutral-100 hover:bg-green-50/50 ${
                  selectedContact?.id === contact.id
                    ? "bg-green-100/30 border-l-4 border-l-green-500"
                    : ""
                }`}
              >
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-full bg-linear-to-br from-green-200 to-orange-300 flex items-center justify-center text-2xl shadow-md">
                    <img src={emm2} alt="avatar" />
                  </div>
                  {contact.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-neutral-800 text-sm truncate">
                    {contact.name}
                  </h3>
                  <p className="text-xs text-neutral-500 truncate">
                    {messages[messages.length - 1].text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-neutral-200/50 flex flex-col ">
          {selectedContact ? (
            <>
              {/* Chat Header */}
              <div className="p-4 sm:p-5 border-b border-neutral-200/50 bg-linear-to-br from-white to-neutral-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-green-200 to-green-300 flex items-center justify-center text-2xl shadow-md">
                      <img src={selectedContact.avatar} alt="" />
                    </div>
                    <div>
                      <h3 className="font-bold text-neutral-800 text-base">
                        {selectedContact.name}
                      </h3>
                      <p className="text-xs  flex items-center gap-1">
                        {selectedContact.online ? (
                          <>
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            <span className="text-green-600">Online</span>
                          </>
                        ) : (
                          <>
                            <span className="w-2 h-2 bg-neutral-500 rounded-full"></span>
                            <span className="text-neutral-600">Offline</span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                  {/* <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5 text-neutral-600" />
                  </button> */}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-linear-to-br from-neutral-50/30 to-green-50/20">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.isOwn ? "justify-end" : "justify-start"
                    } animate-fadeIn`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[70%] px-4 py-3 shadow-lg ${
                        message.isOwn
                          ? "text-white bg-green-600 rounded-2xl rounded-br-sm"
                          : "bg-white text-neutral-800 rounded-2xl rounded-bl-sm shadow-md border border-neutral-200/50"
                      }`}
                    >
                      <p className="text-sm leading-relaxed wrap-break-words text-justify">
                        {message.text}
                      </p>
                      {message.image && (
                        <img
                          src={message.image}
                          className="mt-2 rounded-lg max-h-40 object-cover"
                        />
                      )}
                      {message.attachment && (
                        <p className="text-xs text-blue-600 mt-1">
                          Attachment: {message.attachment}
                        </p>
                      )}
                      <p
                        className={`text-[10px] mt-2 ${
                          message.isOwn
                            ? "text-neutral-200"
                            : "text-neutral-400"
                        }`}
                      >
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 sm:p-5 border-t border-neutral-200/50 bg-linear-to-br from-white to-neutral-50">
                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Image Upload */}
                  <label className="p-2 hover:bg-green-100 transition-colors duration-200 rounded-lg cursor-pointer text-gray-600">
                    <FaRegImage className="h-6 w-6" />
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) =>
                        e.target.files && setImageFile(e.target.files[0])
                      }
                    />
                  </label>

                  {/* Attachment Upload */}
                  <label className="p-2 hover:bg-green-100 transition-colors duration-200 rounded-lg cursor-pointer text-gray-600">
                    <CgAttachment className="h-6 w-6" />
                    <input
                      type="file"
                      hidden
                      onChange={(e) =>
                        e.target.files && setAttachmentFile(e.target.files[0])
                      }
                    />
                  </label>

                  {/* Text input */}
                  <input
                    type="text"
                    placeholder="Send quick messages"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 px-4 py-3 bg-neutral-100 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 text-sm placeholder:text-neutral-400"
                  />

                  {/* Send button */}
                  <div
                    onClick={handleSendMessage}
                    className="p-2 hover:bg-green-100 transition-colors duration-200 rounded-lg cursor-pointer  shrink-0 text-green-600"
                  >
                    <FiSend className="h-6 w-6" />
                  </div>
                </div>

                {/* Selected files info */}
                {imageFile && (
                  <p className="text-xs text-green-600 mt-1">
                    Image: {imageFile.name}
                  </p>
                )}
                {attachmentFile && (
                  <p className="text-xs text-blue-600 mt-1">
                    File: {attachmentFile.name}
                  </p>
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
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </div>
  );
}
