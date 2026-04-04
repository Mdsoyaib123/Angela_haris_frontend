import { useState } from "react";
import { BillingModal } from "./BillingModal";
import SubscriptionCard from "./SubscriptionCard";
import { useGetDashboardStatsQuery } from "@/redux/features/dashboard-stats/dashboardStatsApi";
import { TableSkeleton } from "./TableSkeleton";
import { MdOutlineFileUpload } from "react-icons/md";
import { useExportTransactionsCsvMutation } from "@/redux/features/transactions/transactionsAdminApi";
import ExcelJS from "exceljs";


const ROWS_PER_PAGE = 9;

export default function Subscriptions() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, isLoading } = useGetDashboardStatsQuery();
  console.log("data", data);
  const transactions = data?.data?.transactions || [];
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    string | null
  >(null);

  // Hook for CSV export
  const [exportCsv, { isLoading: isExporting }] =
    useExportTransactionsCsvMutation();

  const handleExportCsv = async () => {
    try {
      // Trigger the mutation and get the blob (which is CSV from backend)
      const blob = await exportCsv().unwrap();

      // Read the blob as text
      const text = await blob.text();

      // Create a new workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Transactions");

      // Simple manual CSV parsing
      const rows = text.split("\n");
      rows.forEach((row) => {
        if (row.trim()) {
          // Splitting by comma, assuming no commas inside the data
          // For more robust CSV parsing, a library like 'papaparse' would be needed.
          worksheet.addRow(row.split(","));
        }
      });

      // Write the workbook to a buffer, create a blob and download it
      const buffer = await workbook.xlsx.writeBuffer();
      const excelBlob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(excelBlob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "transactions.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
      // Optionally show a toast notification here
    }
  };


  const totalPages = Math.ceil(transactions.length / ROWS_PER_PAGE);

  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const paginatedTransactions = transactions.slice(
    startIndex,
    startIndex + ROWS_PER_PAGE,
  );
  // console.log('transactions', transactions)
  console.log("paginatedTransactions", paginatedTransactions);
  return (
    <div>
      <SubscriptionCard />
      <div className="min-h-fit flex flex-col">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pb-5 gap-3 sm:gap-0">
          <h1 className="text-[#0F1325] font-semibold text-lg sm:text-xl">
            Recent Transactions
          </h1>

          {/* Export button with onClick handler and loading state */}
          <button
            onClick={handleExportCsv}
            disabled={isExporting}
            className="text-base sm:text-base font-medium text-white py-2 px-5 sm:py-2.5 sm:px-7 rounded-full bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 active:translate-y-0 active:shadow-md focus:outline-none cursor-pointer flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MdOutlineFileUpload className="h-6 w-6 sm:h-7 sm:w-7" />
            {isExporting ? "Exporting..." : "Export All"}
          </button>
        </div>
        {/* Table Section - Takes full height */}
        <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-4 gap-5 grow">
          <div className="xl:col-span-4 w-full h-full">
            <div className="overflow-x-auto rounded-lg border border-gray-200 h-full flex flex-col">
              <table className="w-full min-w-75">
                <thead className="bg-[#EFEEEE] w-full">
                  <tr>
                    <th className="uppercase p-3 font-semibold font-sans leading-1.4 bg-linear-to-b from-[#6FAACC] to-[#395C70] bg-clip-text text-transparent align-middle text-left whitespace-nowrap">
                      TRANSACTION ID
                    </th>
                    <th className="uppercase p-3 font-semibold font-sans leading-1.4 bg-linear-to-b from-[#6FAACC] to-[#395C70] bg-clip-text text-transparent align-middle text-left whitespace-nowrap">
                      Customer
                    </th>
                    <th className="uppercase p-3 font-semibold font-sans leading-1.4 bg-linear-to-b from-[#6FAACC] to-[#395C70] bg-clip-text text-transparent align-middle text-left whitespace-nowrap">
                      PLAN
                    </th>
                    <th className="uppercase p-3 font-semibold font-sans leading-1.4 bg-linear-to-b from-[#6FAACC] to-[#395C70] bg-clip-text text-transparent align-middle text-left whitespace-nowrap">
                      Amount
                    </th>
                    <th className="uppercase p-3 font-semibold font-sans leading-1.4 bg-linear-to-b from-[#6FAACC] to-[#395C70] bg-clip-text text-transparent align-middle text-left whitespace-nowrap">
                      STATUS
                    </th>
                    <th className="p-3 font-medium font-sans leading-1.4 bg-linear-to-b from-[#6FAACC] to-[#395C70] bg-clip-text text-transparent align-middle text-left whitespace-nowrap">
                      RECEIPT
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <TableSkeleton rows={5} />
                  ) : (
                    paginatedTransactions.map((transaction) => (
                      <tr
                        key={transaction?.transactionId}
                        className="border-b border-[#E0E0E1]"
                      >
                        <td className="align-middle p-3 whitespace-nowrap">
                          <span className="text-base text-[#1E242C] font-medium">
                            {transaction?.transactionId}
                          </span>
                        </td>
                        <td className="align-middle p-3 whitespace-nowrap">
                          <span className="text-base text-[#1E242C] font-medium">
                            {transaction?.customer}
                          </span>
                        </td>
                        <td className="align-middle p-3 whitespace-nowrap">
                          <button
                            onClick={() => {
                              setSelectedTransactionId(transaction?.id); // assuming transaction has an `id` field
                              setIsModalOpen(true);
                            }}
                            className="text-base font-medium text-white py-2.5 px-7 rounded-full bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 active:translate-y-0 active:shadow-md focus:outline-none cursor-pointer"
                          >
                            {/* {Number(transaction.amount) < 99
                              ? "Monthly"
                              : "Annually"} */}
                            {transaction?.plan}
                          </button>
                        </td>
                        <td className="align-middle p-3 whitespace-nowrap">
                          <span className="text-base text-[#1E242C] font-medium">
                            {transaction?.amount}
                          </span>
                        </td>
                        <td className="align-middle p-3 whitespace-nowrap">
                          <span
                            className={`text-base font-medium ${transaction?.status === "Successfull" ? "text-[#2EBC03]" : "text-[#FF0000]"}`}
                          >
                            {transaction?.status}
                          </span>
                        </td>
                        <td className="align-middle p-3 whitespace-nowrap">
                          {transaction.recieptUrl && (
                            <a
                              href={transaction.recieptUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-base text-[#2EBC03] font-medium"
                            >
                              Download
                            </a>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot>
                  {/* Pagination */}
                  <tr>
                    <td colSpan={6} className="p-3 bg-[#EFEEEE]">
                      <div className="flex items-center justify-center gap-2 ">
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
                        {Array.from({ length: totalPages }).map((_, index) => {
                          const page = index + 1;
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`h-7 w-7 flex items-center justify-center rounded-full text-base cursor-pointer
        ${currentPage === page
                                  ? "bg-linear-to-b from-[#6FAACC] to-[#395C70] text-white"
                                  : "text-black hover:bg-linear-to-b hover:from-[#6FAACC] hover:to-[#395C70] hover:text-white"
                                }`}
                            >
                              {page}
                            </button>
                          );
                        })}

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
      <BillingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transactionId={selectedTransactionId}
      />
    </div>
  );
}
