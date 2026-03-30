import { useState } from "react";
import { Transaction } from "@/redux/types/transactions.type";

import { useGetTransactionsQuery } from "@/redux/features/transactions/transactionsAdminApi";
import Loader from "@/components/AdminDashboard/Shared/Loader";

const ROWS_PER_PAGE = 4;

export default function AdminTransaction() {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError } = useGetTransactionsQuery();

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
      <h1 className="text-[#0F1325] font-semibold text-xl mb-3">
        Recent Transactions
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
                    {paginatedTransactions.map((t: Transaction) => (
                      <tr key={t.id} className="border-b border-[#E0E0E1]">
                        <td className="align-middle p-3 whitespace-nowrap">
                          {t.transactionId}
                        </td>
                        <td className="align-middle p-3 whitespace-nowrap">
                          {t.user}
                        </td>
                        <td className="align-middle p-3 whitespace-nowrap">
                          <button className="text-base font-medium text-white py-2.5 px-7 rounded-full bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 active:translate-y-0 active:shadow-md focus:outline-none cursor-pointer">
                            {t.amount < 99 ? "Monthly" : "Annually"}
                          </button>
                        </td>
                        <td className="align-middle p-3 whitespace-nowrap">
                          ${t.amount.toFixed(2)} {t.currency.toUpperCase()}
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
