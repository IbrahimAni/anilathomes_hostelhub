import { PaymentFilterType } from "@/app/types/payment";

interface PaymentFilterTabsProps {
  activeFilter: PaymentFilterType;
  setActiveFilter: (filter: PaymentFilterType) => void;
}

export default function PaymentFilterTabs({ activeFilter, setActiveFilter }: PaymentFilterTabsProps) {
  return (
    <div className="border-b border-gray-200">
      <div className="flex space-x-8">
        <button
          onClick={() => setActiveFilter('all')}
          className={`py-3 border-b-2 font-medium text-sm ${
            activeFilter === 'all'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
          data-testid="filter-all"
        >
          All Payments
        </button>
        <button
          onClick={() => setActiveFilter('successful')}
          className={`py-3 border-b-2 font-medium text-sm ${
            activeFilter === 'successful'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
          data-testid="filter-successful"
        >
          Successful
        </button>
        <button
          onClick={() => setActiveFilter('pending')}
          className={`py-3 border-b-2 font-medium text-sm ${
            activeFilter === 'pending'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
          data-testid="filter-pending"
        >
          Pending
        </button>
        <button
          onClick={() => setActiveFilter('failed')}
          className={`py-3 border-b-2 font-medium text-sm ${
            activeFilter === 'failed'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
          data-testid="filter-failed"
        >
          Failed
        </button>
      </div>
    </div>
  );
}
