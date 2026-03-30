import user from "@/assets/icons/user.svg";

export type Notification = {
  id: string;
  avatar: string;
  name: string;
  message: string;
  time: string;
};

const mockNotifications: Notification[] = [
  {
    id: "1",
    avatar: user,
    name: "John Smith",
    message: "Great, I will see you at 10 AM",
    time: "10:30 AM",
  },
  {
    id: "2",
    avatar: user,
    name: "John Smith",
    message: "Great, I will see you at 10 AM",
    time: "10:30 AM",
  },
  {
    id: "3",
    avatar: user,
    name: "John Smith",
    message: "Great, I will see you at 10 AM",
    time: "10:30 AM",
  },
  {
    id: "4",
    avatar: user,
    name: "John Smith",
    message: "Great, I will see you at 10 AM",
    time: "10:30 AM",
  },
];

export function NotificationPanel() {
  return (
    <div className="w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-900">Notifications</h2>
      </div>

      {/* Notification List */}
      <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {mockNotifications.map((notification) => (
          <div
            key={notification.id}
            className="px-5 py-4 transition-all cursor-pointer hover:bg-gray-50"
          >
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <img
                src={notification.avatar || "/placeholder.svg"}
                alt={notification.name}
                className="w-10 h-10 rounded-full object-cover shrink-0"
              />

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {notification.name}
                  </p>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {notification.time}
                  </span>
                </div>

                <p className="mt-1 text-xs text-gray-500 line-clamp-2 leading-relaxed">
                  {notification.message}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// import user from "@/assets/icons/user.svg";
// export type Notification = {
//   id: string;
//   avatar: string;
//   name: string;
//   message: string;
//   time: string;
// };

// const mockNotifications: Notification[] = [
//   {
//     id: "1",
//     avatar: user,
//     name: "John Smith",
//     message: "Great, I will see you at 10 AM",
//     time: "10:30 AM",
//   },
//   {
//     id: "2",
//     avatar: user,
//     name: "John Smith",
//     message: "Great, I will see you at 10 AM",
//     time: "10:30 AM",
//   },
//   {
//     id: "3",
//     avatar: user,
//     name: "John Smith",
//     message: "Great, I will see you at 10 AM",
//     time: "10:30 AM",
//   },
//   {
//     id: "4",
//     avatar: user,
//     name: "John Smith",
//     message: "Great, I will see you at 10 AM",
//     time: "10:30 AM",
//   },
//   {
//     id: "5",
//     avatar: user,
//     name: "John Smith",
//     message: "Great, I will see you at 10 AM",
//     time: "10:30 AM",
//   },
//   {
//     id: "6",
//     avatar: user,
//     name: "John Smith",
//     message: "Great, I will see you at 10 AM",
//     time: "10:30 AM",
//   },
//   {
//     id: "7",
//     avatar: user,
//     name: "John Smith",
//     message: "Great, I will see you at 10 AM",
//     time: "10:30 AM",
//   },
// ];

// export function NotificationPanel() {
//   return (
//     <div className="w-max  bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
//       <div className=" px-4 py-3">
//         <h2 className="text-sm font-semibold text-foreground">Notifications</h2>
//       </div>

//       <div className="max-h-96 overflow-y-auto">
//         {mockNotifications.map((notification) => (
//           <div
//             key={notification.id}
//             className="px-5 py-3 hover:bg-muted transition-colors cursor-pointer hover:bg-neutral-100"
//           >
//             <div className="flex items-center gap-2">
//               <img
//                 src={notification.avatar || "/placeholder.svg"}
//                 alt={notification.name}
//                 width={40}
//                 height={40}
//                 className="w-10 h-10 rounded-full shrink-0 object-cover"
//               />
//               <div className="h-fit">
//                 <div className="flex items-center justify-between gap-2 ">
//                   <p className="text-sm font-medium text-foreground truncate leading-3 ">
//                     {notification.name}
//                   </p>
//                   <span className="text-xs text-muted-foreground shrink-0 leading-2">
//                     {notification.time}
//                   </span>
//                 </div>
//                 <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-3 ">
//                   {notification.message}
//                 </p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
