import React from "react";

import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { TransactionRecord, TransactionStatus } from "@/src/types/index.type";

interface TransactionHistoryTableProps {
  data: TransactionRecord[];
}

const TransactionHistoryTable: React.FC<TransactionHistoryTableProps> = ({
  data,
}) => {
  const getStatusStyles = (status: TransactionStatus): string => {
    switch (status) {
      case TransactionStatus.COMPLETED:
        return "bg-green-100 text-green-800 border-green-200";
      case TransactionStatus.PENDING:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case TransactionStatus.PROCESSING:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case TransactionStatus.FAILED:
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusLabel = (status: TransactionStatus): string => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No transaction history found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">
              Date
            </th>
            <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">
              Status
            </th>
            <th className="text-right py-4 px-4 text-sm font-semibold text-gray-700">
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((record) => (
            <tr
              key={record.id}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td className="py-4 px-4">
                <div className="flex items-center gap-2">
                  {record.type === "credit" ? (
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <ArrowDownLeft className="w-4 h-4 text-green-600" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                      <ArrowUpRight className="w-4 h-4 text-red-600" />
                    </div>
                  )}
                  <span className="text-sm text-gray-900">
                    {/* {formatDate(record.date)} */}
                    {record.date}
                  </span>
                </div>
              </td>
              <td className="py-4 px-4">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyles(record.status)}`}
                >
                  {getStatusLabel(record.status)}
                </span>
              </td>
              <td className="py-4 px-4 text-sm font-semibold text-right">
                <span
                  className={
                    record.type === "credit" ? "text-green-600" : "text-red-600"
                  }
                >
                  {record.type === "credit" ? "+" : "-"}
                  {/* {formatCurrency(record.amount)} */}
                  {record.amount}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionHistoryTable;
