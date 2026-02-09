// components/WithdrawalHistoryTable.tsx
import { TransactionStatus, WithdrawalRecord } from "@/src/types/index.type";
import { formatDateToMMDDYYYY } from "@/src/utils/helperFunctions";
import { ChevronRight, FileDown, Funnel } from "lucide-react";
import React from "react";
// import { formatDate, formatCurrency } from '../utils/formatters';

interface WithdrawalHistoryTableProps {
  data: WithdrawalRecord[];
}

const WithdrawalHistoryTable: React.FC<WithdrawalHistoryTableProps> = ({
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
        <p className="text-gray-500">No withdrawal history found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center w-full px-4">
        <h1 className="text-lg font-semibold">Withdrawal History</h1>
        <div className="flex gap-2">
          <div className="bg-primary/20 p-1.5 rounded-md">
            <FileDown className=" text-primary " />
          </div>
          <div className="bg-primary p-1.5 rounded-md">
            <Funnel className=" text-white " />
          </div>
        </div>
      </div>
      <table className="w-full">
        <thead>
          <tr className="">
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
            <tr key={record.id} className=" ">
              <td className="py-4 px-4 text-sm text-gray-900">
                {formatDateToMMDDYYYY(record.date)}
              </td>
              <td className="py-4 px-4">
                <span
                  className={`inline-flex items-center text-xs font-medium `}
                >
                  {record.status}
                </span>
              </td>
              <td className="py-4 px-4 text-sm font-semibold text-right text-gray-900">
                <span>{record.date}</span>
                <span>
                  <ChevronRight />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WithdrawalHistoryTable;
