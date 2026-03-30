import SubscriptionCard from "./SubscriptionCard";
import { MdOutlineFileUpload } from "react-icons/md";

import { useState } from "react";

import Loader from "@/components/AdminDashboard/Shared/Loader";
import { useGetUserTransactionsQuery } from "@/redux/features/transactions/transactionsUserApi";
import { TransactionUser } from "@/redux/types/transactionsUser.type";
import { useExportMeTransactionsCsvMutation } from "@/redux/features/stripe/stripeApi";

const ROWS_PER_PAGE = 4;

export default function SubscriptionAndBilling() {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError } = useGetUserTransactionsQuery();

  const [exportCsv, { isLoading: isExporting }] =
    useExportMeTransactionsCsvMutation();

  const handleExportCsv = async () => {
    try {
      // Trigger the mutation and get the blob
      const blob = await exportCsv().unwrap();

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "transactions.csv"); // filename
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
      // Optionally show a toast notification here
    }
  };

  if (isLoading) return <Loader />;
  if (isError) return <p>Error fetching transactions!</p>;

  const transactions = data?.data || [];
  const totalPages = Math.ceil(transactions.length / ROWS_PER_PAGE);

  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const paginatedTransactions = transactions.slice(
    startIndex,
    startIndex + ROWS_PER_PAGE,
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Top Section: Subscription Card */}
      <div className="w-full">
        <SubscriptionCard />
      </div>

      {/* Bottom Section: Recent Transactions */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pb-5 gap-3">
          <h1 className="text-[#0F1325] font-semibold text-lg sm:text-xl">
            Recent Transactions
          </h1>

          {/* Export button with onClick handler and loading state */}
          <button
            onClick={handleExportCsv}
            disabled={isExporting}
            className="w-full sm:w-auto text-sm sm:text-base font-medium text-white py-2 px-5 sm:py-2.5 sm:px-7 rounded-full bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 active:translate-y-0 active:shadow-md focus:outline-none cursor-pointer flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MdOutlineFileUpload className="h-5 w-5 sm:h-6 sm:w-6" />
            {isExporting ? "Exporting..." : "Export All (CSV)"}
          </button>
        </div>

        <div className="w-full">
          {/* Table for Desktop/Tablet (md and up) */}
          <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200 h-full">
            <table className="w-full">
              <thead className="bg-[#EFEEEE] w-full">
                <tr>
                  <th className="p-2.5 text-xs sm:text-sm font-medium font-sans bg-linear-to-b from-[#6FAACC] to-[#395C70] bg-clip-text text-transparent align-middle text-left whitespace-nowrap">
                    TRANSACTION ID
                  </th>
                  <th className="p-2.5 text-xs sm:text-sm font-medium font-sans bg-linear-to-b from-[#6FAACC] to-[#395C70] bg-clip-text text-transparent align-middle text-left whitespace-nowrap">
                    USER
                  </th>
                  <th className="p-2.5 text-xs sm:text-sm font-medium font-sans bg-linear-to-b from-[#6FAACC] to-[#395C70] bg-clip-text text-transparent align-middle text-left whitespace-nowrap">
                    PLAN
                  </th>
                  <th className="p-2.5 text-xs sm:text-sm font-medium font-sans bg-linear-to-b from-[#6FAACC] to-[#395C70] bg-clip-text text-transparent align-middle text-left whitespace-nowrap">
                    AMOUNT
                  </th>
                  <th className="p-2.5 text-xs sm:text-sm font-medium font-sans bg-linear-to-b from-[#6FAACC] to-[#395C70] bg-clip-text text-transparent align-middle text-left whitespace-nowrap">
                    STATUS
                  </th>
                  <th className="p-2.5 text-xs sm:text-sm font-medium font-sans bg-linear-to-b from-[#6FAACC] to-[#395C70] bg-clip-text text-transparent align-middle text-left whitespace-nowrap">
                    RECEIPT
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedTransactions.map((t: TransactionUser) => (
                  <tr
                    key={t.transactionId}
                    className="border-b border-[#E0E0E1] text-sm sm:text-base"
                  >
                    <td className="align-middle p-2.5 whitespace-nowrap text-xs sm:text-sm">
                      {t.transactionId}
                    </td>
                    <td className="align-middle p-2.5 whitespace-nowrap text-xs sm:text-sm">
                      {t.username}
                    </td>
                    <td className="align-middle p-2.5 whitespace-nowrap">
                      <button className="text-xs sm:text-sm font-medium text-white py-1 px-3 rounded-full bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 active:translate-y-0 active:shadow-md focus:outline-none cursor-pointer">
                        {Number(t.amount || 0) < 99 ? "Monthly" : "Annually"}
                      </button>
                    </td>
                    <td className="align-middle p-2.5 whitespace-nowrap text-xs sm:text-sm">
                      ${Number(t.amount || 0).toFixed(2)}
                    </td>
                    <td className="align-middle p-2.5 whitespace-nowrap">
                      <span
                        className={`text-xs sm:text-sm font-medium ${
                          t.status === "Successfull"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="align-middle p-2.5 whitespace-nowrap">
                      {t.receiptUrl && (
                        <a
                          href={t.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs sm:text-sm text-[#2EBC03] font-medium hover:underline"
                        >
                          Download
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards for Mobile (under md) */}
          <div className="md:hidden flex flex-col gap-4">
            {paginatedTransactions.map((t: TransactionUser) => (
              <div
                key={t.transactionId}
                className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                      Transaction ID
                    </p>
                    <p className="text-xs font-mono text-gray-600">
                      {t.transactionId}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      t.status === "Successfull"
                        ? "bg-green-50 text-green-600 border border-green-100"
                        : "bg-red-50 text-red-600 border border-red-100"
                    }`}
                  >
                    {t.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                      Plan
                    </p>
                    <button className="text-[10px] font-bold text-white py-1 px-3 rounded-full bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] mt-1">
                      {Number(t.amount || 0) < 99 ? "Monthly" : "Annually"}
                    </button>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                      Amount
                    </p>
                    <p className="text-sm font-bold text-gray-900 mt-1">
                      ${Number(t.amount || 0).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    User:{" "}
                    <span className="text-gray-900 font-medium">
                      {t.username}
                    </span>
                  </span>
                  {t.receiptUrl && (
                    <a
                      href={t.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#2EBC03] font-bold flex items-center gap-1"
                    >
                      Receipt
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-center gap-2 p-3 bg-[#EFEEEE] rounded-xl md:rounded-b-lg md:rounded-t-none">
            {/* Prev */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="h-8 w-8 flex items-center justify-center rounded-full text-lg font-normal text-black bg-white/50 border border-gray-200 transition-all duration-150 ease-out hover:bg-linear-to-b hover:from-[#6FAACC] hover:to-[#395C70] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              ‹
            </button>

            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, index) => {
                const page = index + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`h-8 w-8 flex items-center justify-center rounded-full text-sm font-medium cursor-pointer transition-all duration-200 ${
                      currentPage === page
                        ? "bg-linear-to-b from-[#6FAACC] to-[#395C70] text-white shadow-md scale-110"
                        : "text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            {/* Next */}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="h-8 w-8 flex items-center justify-center rounded-full text-lg font-normal text-black bg-white/50 border border-gray-200 transition-all duration-150 ease-out hover:bg-linear-to-b hover:from-[#6FAACC] hover:to-[#395C70] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
