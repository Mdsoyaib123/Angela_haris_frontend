// import { useState } from "react";
// import PricingCard from "./PricingCard";
// import BasicCard from "./BasicCard";

// const ROWS_PER_PAGE = 9;

// // Dummy data for transactions
// const transactions = [
//   {
//     id: 1,
//     transactionId: "TXN-8903",
//     user: "Alice Johnson",
//     plan: "Pro Prospect",
//     totalView: "$29.00",
//     status: "Successfull",
//   },
//   {
//     id: 2,
//     transactionId: "TXN-8904",
//     user: "Bob Smith",
//     plan: "Pro Prospect",
//     totalView: "$19.00",
//     status: "Successfull",
//   },
//   {
//     id: 3,
//     transactionId: "TXN-8905",
//     user: "Carol Davis",
//     plan: "Pro Prospect",
//     totalView: "$49.00",
//     status: "Successfull",
//   },
//   {
//     id: 4,
//     transactionId: "TXN-8906",
//     user: "David Wilson",
//     plan: "Pro Prospect",
//     totalView: "$29.00",
//     status: "Successfull",
//   },
//   {
//     id: 5,
//     transactionId: "TXN-8907",
//     user: "Eva Brown",
//     plan: "Pro Prospect",
//     totalView: "$19.00",
//     status: "Successfull",
//   },
//   {
//     id: 6,
//     transactionId: "TXN-8908",
//     user: "Frank Miller",
//     plan: "Pro Prospect",
//     totalView: "$49.00",
//     status: "Successfull",
//   },
//   {
//     id: 7,
//     transactionId: "TXN-8909",
//     user: "Grace Taylor",
//     plan: "Pro Prospect",
//     totalView: "$29.00",
//     status: "Successfull",
//   },
//   {
//     id: 8,
//     transactionId: "TXN-8910",
//     user: "Henry Anderson",
//     plan: "Pro Prospect",
//     totalView: "$19.00",
//     status: "Successfull",
//   },
//   {
//     id: 9,
//     transactionId: "TXN-8911",
//     user: "Irene Thomas",
//     plan: "Pro Prospect",
//     totalView: "$49.00",
//     status: "Successfull",
//   },
//   {
//     id: 10,
//     transactionId: "TXN-8912",
//     user: "Jack White",
//     plan: "Pro Prospect",
//     totalView: "$29.00",
//     status: "Successfull",
//   },
//   {
//     id: 11,
//     transactionId: "TXN-8913",
//     user: "Karen Harris",
//     plan: "Pro Prospect",
//     totalView: "$19.00",
//     status: "Successfull",
//   },
//   {
//     id: 12,
//     transactionId: "TXN-8914",
//     user: "Leo Martin",
//     plan: "Pro Prospect",
//     totalView: "$49.00",
//     status: "Successfull",
//   },
//   {
//     id: 13,
//     transactionId: "TXN-8915",
//     user: "Mona Clark",
//     plan: "Pro Prospect",
//     totalView: "$29.00",
//     status: "Successfull",
//   },
//   {
//     id: 14,
//     transactionId: "TXN-8916",
//     user: "Nathan Lewis",
//     plan: "Pro Prospect",
//     totalView: "$19.00",
//     status: "Successfull",
//   },
//   {
//     id: 15,
//     transactionId: "TXN-8917",
//     user: "Olivia Walker",
//     plan: "Pro Prospect",
//     totalView: "$49.00",
//     status: "Successfull",
//   },
//   {
//     id: 16,
//     transactionId: "TXN-8918",
//     user: "Paul Hall",
//     plan: "Pro Prospect",
//     totalView: "$29.00",
//     status: "Successfull",
//   },
//   {
//     id: 17,
//     transactionId: "TXN-8919",
//     user: "Quinn Allen",
//     plan: "Pro Prospect",
//     totalView: "$19.00",
//     status: "Successfull",
//   },
//   {
//     id: 18,
//     transactionId: "TXN-8920",
//     user: "Rachel Young",
//     plan: "Pro Prospect",
//     totalView: "$49.00",
//     status: "Successfull",
//   },
//   {
//     id: 19,
//     transactionId: "TXN-8921",
//     user: "Sam King",
//     plan: "Pro Prospect",
//     totalView: "$29.00",
//     status: "Successfull",
//   },
//   {
//     id: 20,
//     transactionId: "TXN-8922",
//     user: "Tina Scott",
//     plan: "Pro Prospect",
//     totalView: "$19.00",
//     status: "Successfull",
//   },
// ];

// const basicFeatures = [
//   { text: "Build shareable athlete profile" },
//   { text: "Create athlete highlight reels" },
//   { text: "Unlimited Storage" },
// ];

// export default function UserSubscription() {
//   const [currentPage, setCurrentPage] = useState(1);

//   const totalPages = Math.ceil(transactions.length / ROWS_PER_PAGE);

//   const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
//   const paginatedTransactions = transactions.slice(
//     startIndex,
//     startIndex + ROWS_PER_PAGE,
//   );
//   return (
//     <div>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
//         <BasicCard
//           features={basicFeatures}
//           onPurchase={() => console.log("Purchase 1 clicked")}
//         />

//         <PricingCard />
//       </div>
//       <h1 className="text-[#0F1325] font-semibold text-xl mb-3">
//         Recent Transactions
//       </h1>
//       <div className="w-full flex flex-col xl:flex-row xl:items-start gap-4 xl:gap-6">
//         <div className="w-full order-2 xl:order-1 xl:flex-[2.4]">
//           {/* Table Section - Takes full height */}
//           <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-4 gap-5 grow">
//             <div className="xl:col-span-4 w-full h-full">
//               <div className="overflow-x-auto rounded-lg border border-gray-200 h-full flex flex-col">
//                 <table className="w-full min-w-75">
//                   <thead className="bg-[#EFEEEE] w-full">
//                     <tr>
//                       <th className="p-3 font-medium font-sans leading-1.4 bg-linear-to-b from-[#6FAACC] to-[#395C70] bg-clip-text text-transparent align-middle text-left whitespace-nowrap">
//                         TRANSACTION ID
//                       </th>
//                       <th className="p-3 font-medium font-sans leading-1.4 bg-linear-to-b from-[#6FAACC] to-[#395C70] bg-clip-text text-transparent align-middle text-left whitespace-nowrap">
//                         User
//                       </th>
//                       <th className="p-3 font-medium font-sans leading-1.4 bg-linear-to-b from-[#6FAACC] to-[#395C70] bg-clip-text text-transparent align-middle text-left whitespace-nowrap">
//                         PLAN
//                       </th>
//                       <th className="p-3 font-medium font-sans leading-1.4 bg-linear-to-b from-[#6FAACC] to-[#395C70] bg-clip-text text-transparent align-middle text-left whitespace-nowrap">
//                         Total View
//                       </th>
//                       <th className="p-3 font-medium font-sans leading-1.4 bg-linear-to-b from-[#6FAACC] to-[#395C70] bg-clip-text text-transparent align-middle text-left whitespace-nowrap">
//                         STATUS
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {paginatedTransactions.map((transaction) => (
//                       <tr
//                         key={transaction.id}
//                         className="border-b border-[#E0E0E1]"
//                       >
//                         <td className="align-middle p-3 whitespace-nowrap">
//                           <span className="text-base text-[#1E242C] font-medium">
//                             {transaction.transactionId}
//                           </span>
//                         </td>
//                         <td className="align-middle p-3 whitespace-nowrap">
//                           <span className="text-base text-[#1E242C] font-medium">
//                             {transaction.user}
//                           </span>
//                         </td>
//                         <td className="align-middle p-3 whitespace-nowrap">
//                           <button className="text-base font-medium text-white py-2.5 px-7 rounded-full bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 active:translate-y-0 active:shadow-md focus:outline-none cursor-pointer">
//                             {transaction.plan}
//                           </button>
//                         </td>
//                         <td className="align-middle p-3 whitespace-nowrap">
//                           <span className="text-base text-[#1E242C] font-medium">
//                             {transaction.totalView}
//                           </span>
//                         </td>
//                         <td className="align-middle p-3 whitespace-nowrap">
//                           <span
//                             className={`text-base font-medium ${transaction.status === "Successfull" ? "text-[#2EBC03]" : "text-[#FF0000]"}`}
//                           >
//                             {transaction.status}
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                   <tfoot>
//                     {/* Pagination */}
//                     <tr>
//                       <td colSpan={5} className="p-3 bg-[#EFEEEE]">
//                         <div className="flex items-center justify-center gap-2 ">
//                           {/* Prev */}
//                           <button
//                             onClick={() =>
//                               setCurrentPage((p) => Math.max(p - 1, 1))
//                             }
//                             disabled={currentPage === 1}
//                             className=" h-7 w-7 flex items-center justify-center rounded-full text-base font-normal text-black bg-transparent transition-all duration-150 ease-out hover:bg-linear-to-b hover:from-[#6FAACC] hover:to-[#395C70] hover:text-white active:bg-linear-to-b active:from-[#6FAACC] active:to-[#395C70] active:text-white disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
//                           >
//                             ‹
//                           </button>

//                           {/* Page numbers */}
//                           {Array.from({ length: totalPages }).map(
//                             (_, index) => {
//                               const page = index + 1;
//                               return (
//                                 <button
//                                   key={page}
//                                   onClick={() => setCurrentPage(page)}
//                                   className={`h-7 w-7 flex items-center justify-center rounded-full text-base cursor-pointer
//         ${
//           currentPage === page
//             ? "bg-linear-to-b from-[#6FAACC] to-[#395C70] text-white"
//             : "text-black hover:bg-linear-to-b hover:from-[#6FAACC] hover:to-[#395C70] hover:text-white"
//         }`}
//                                 >
//                                   {page}
//                                 </button>
//                               );
//                             },
//                           )}

//                           {/* Next */}
//                           <button
//                             onClick={() =>
//                               setCurrentPage((p) => Math.min(p + 1, totalPages))
//                             }
//                             disabled={currentPage === totalPages}
//                             className=" h-7 w-7 flex items-center justify-center rounded-full text-base font-normal text-black bg-transparent transition-all duration-150 ease-out hover:bg-linear-to-b hover:from-[#6FAACC] hover:to-[#395C70] hover:text-white active:bg-linear-to-b active:from-[#6FAACC] active:to-[#395C70] active:text-white disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
//                           >
//                             ›
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   </tfoot>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

/*  */

// src/components/UserSubscription.tsx

import { useState } from "react";
// import { Transaction } from "@/redux/types/transactions.type";
import PricingCard from "./PricingCard";
import BasicCard from "./BasicCard";
// import { useGetTransactionsQuery } from "@/redux/features/transactions/transactionsAdminApi";
import Loader from "@/components/AdminDashboard/Shared/Loader";
import { useGetUserTransactionsQuery } from "@/redux/features/transactions/transactionsUserApi";
import { TransactionUser } from "@/redux/types/transactionsUser.type";

const ROWS_PER_PAGE = 4;

const basicFeatures = [
  { text: "Build shareable athlete profiles" },
  { text: "Upload up to 3 video clips" },
  { text: "Create one athlete highlight reel" },
  { text: "Unlimited Storage" },
];

export default function UserSubscription() {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError } = useGetUserTransactionsQuery();

  if (isLoading) return <Loader />;
  if (isError) return <p>Error fetching transactions!</p>;

  const transactions = data?.data || [];
  const totalPages = Math.ceil(transactions.length / ROWS_PER_PAGE);

  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const paginatedTransactions = transactions.slice(
    startIndex,
    startIndex + ROWS_PER_PAGE,
  );

  // console.log(paginatedTransactions[0].id, "paginatedTransactions");
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <BasicCard
          features={basicFeatures}
          onPurchase={() => console.log("Purchase clicked")}
        />
        <PricingCard />
      </div>

      <h1 className="text-[#0F1325] font-semibold text-xl mb-3">
        Subscription Options
      </h1>

      <div className="w-full flex flex-col xl:flex-row xl:items-start gap-4 xl:gap-6">
        <div className="w-full order-2 xl:order-1 xl:flex-[2.4]">
          <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-4 gap-5 grow">
            <div className="xl:col-span-4 w-full h-full">
              <div className="overflow-x-auto rounded-lg border border-gray-200 h-full flex flex-col">
                <table className="w-full min-w-75">
                  <thead className="bg-[#EFEEEE] w-full">
                    <tr>
                      <th className="p-3 font-medium font-sans leading-1.4 bg-linear-to-b from-[#6FAACC] to-[#395C70] bg-clip-text text-transparent align-middle text-left whitespace-nowrap">
                        TRANSACTION ID
                      </th>
                      <th className="p-3 font-medium font-sans leading-1.4 bg-linear-to-b from-[#6FAACC] to-[#395C70] bg-clip-text text-transparent align-middle text-left whitespace-nowrap">
                        User
                      </th>
                      <th className="p-3 font-medium font-sans leading-1.4 bg-linear-to-b from-[#6FAACC] to-[#395C70] bg-clip-text text-transparent align-middle text-left whitespace-nowrap">
                        PLAN
                      </th>
                      <th className="p-3 font-medium font-sans leading-1.4 bg-linear-to-b from-[#6FAACC] to-[#395C70] bg-clip-text text-transparent align-middle text-left whitespace-nowrap">
                        AMOUNT
                      </th>
                      <th className="p-3 font-medium font-sans leading-1.4 bg-linear-to-b from-[#6FAACC] to-[#395C70] bg-clip-text text-transparent align-middle text-left whitespace-nowrap">
                        STATUS
                      </th>
                      <th className="p-3 font-medium font-sans leading-1.4 bg-linear-to-b from-[#6FAACC] to-[#395C70] bg-clip-text text-transparent align-middle text-left whitespace-nowrap">
                        RECEIPT
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedTransactions.map((t: TransactionUser) => (
                      <tr
                        key={t.transactionId}
                        className="border-b border-[#E0E0E1]"
                      >
                        <td className="align-middle p-3 whitespace-nowrap">
                          {t.transactionId}
                        </td>
                        <td className="align-middle p-3 whitespace-nowrap">
                          {t.username}
                        </td>
                        <td className="align-middle p-3 whitespace-nowrap">
                          <button className="text-base font-medium text-white py-2.5 px-7 rounded-full bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 active:translate-y-0 active:shadow-md focus:outline-none cursor-pointer">
                            {Number(t.amount || 0) < 99
                              ? "Monthly"
                              : "Annually"}
                          </button>
                        </td>
                        <td className="align-middle p-3 whitespace-nowrap">
                          ${Number(t.amount || 0).toFixed(2)}
                        </td>
                        <td className="align-middle p-3 whitespace-nowrap">
                          <span
                            className={`${
                              t.status === "Successfull"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {t.status}
                          </span>
                        </td>
                        <td className="align-middle p-3 whitespace-nowrap">
                          {t.receiptUrl && (
                            <a
                              href={t.receiptUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-base text-[#2EBC03] font-medium"
                            >
                              Download
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={6} className="p-3 bg-[#EFEEEE]">
                        <div className="flex items-center justify-center gap-2">
                          {/* Prev */}
                          <button
                            onClick={() =>
                              setCurrentPage((p) => Math.max(p - 1, 1))
                            }
                            disabled={currentPage === 1}
                            className=" h-7 w-7 flex items-center justify-center rounded-full text-base font-normal text-black bg-transparent transition-all duration-150 ease-out hover:bg-linear-to-b hover:from-[#6FAACC] hover:to-[#395C70] hover:text-white active:bg-linear-to-b active:from-[#6FAACC] active:to-[#395C70] active:text-white disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                          >
                            ‹
                          </button>

                          {/* Page numbers */}
                          {Array.from({ length: totalPages }).map(
                            (_, index) => {
                              const page = index + 1;
                              return (
                                <button
                                  key={page}
                                  onClick={() => setCurrentPage(page)}
                                  className={`h-7 w-7 flex items-center justify-center rounded-full text-base cursor-pointer${
                                    currentPage === page
                                      ? "bg-linear-to-b from-[#6FAACC] to-[#395C70] text-white"
                                      : "text-black hover:bg-linear-to-b hover:from-[#6FAACC] hover:to-[#395C70] hover:text-white"
                                  }`}
                                >
                                  {page}
                                </button>
                              );
                            },
                          )}

                          {/* Next */}
                          <button
                            onClick={() =>
                              setCurrentPage((p) => Math.min(p + 1, totalPages))
                            }
                            disabled={currentPage === totalPages}
                            className=" h-7 w-7 flex items-center justify-center rounded-full text-base font-normal text-black bg-transparent transition-all duration-150 ease-out hover:bg-linear-to-b hover:from-[#6FAACC] hover:to-[#395C70] hover:text-white active:bg-linear-to-b active:from-[#6FAACC] active:to-[#395C70] active:text-white disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                          >
                            ›
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
