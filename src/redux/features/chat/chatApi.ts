import { baseApi } from "@/redux/hooks/baseApi";

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get chat contact list with last message
    getChatList: builder.query({
      query: () => `/chat/list`,
      providesTags: ["ChatList"],
    }),

    // ✅ Get message history with a specific contact
    getMessages: builder.query({
      query: (contactId) => `/chat/history/${contactId}`,
      providesTags: (_result, _err, contactId) => [
        { type: "ChatHistory", id: contactId },
      ],
    }),

    // ✅ Upload files
    uploadFile: builder.mutation({
      query: (formData) => ({
        url: "/chat/upload",
        method: "POST",
        body: formData,
      }),
    }),

    // ✅ Start a new conversation
    startConversation: builder.mutation({
      query: (participantId) => ({
        url: `/chat/start/${participantId}`,
        method: "POST",
      }),
      invalidatesTags: ["ChatList"],
    }),
  }),
});

export const {
  useGetChatListQuery,
  useGetMessagesQuery,
  useUploadFileMutation,
  useStartConversationMutation,
} = chatApi;
