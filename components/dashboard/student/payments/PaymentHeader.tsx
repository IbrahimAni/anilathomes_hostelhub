import { FiCreditCard } from "react-icons/fi";

interface PaymentHeaderProps {
  transactionCount: number;
}

export default function PaymentHeader({ transactionCount }: PaymentHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">Payment History</h1>
      <div 
        className="bg-gray-100 text-gray-800 py-1 px-3 rounded-full flex items-center text-sm"
        data-testid="transaction-counter"
      >
        <FiCreditCard className="mr-1" />
        <span>{transactionCount} Transactions</span>
      </div>
    </div>
  );
}
