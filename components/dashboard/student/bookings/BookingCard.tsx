import { useRouter } from "next/navigation";
import { FiExternalLink, FiDownload } from "react-icons/fi";
import { Booking } from "@/types/booking";
import { formatDate } from "@/utils/dateFormatter";
import StatusBadge from "./StatusBadge";
import PaymentBadge from "./PaymentBadge";

interface BookingCardProps {
  booking: Booking;
}

export default function BookingCard({ booking }: BookingCardProps) {
  const router = useRouter();

  return (
    <div data-testid={`booking-card-${booking.id}`} className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex flex-col md:flex-row justify-between">
        <div className="mb-4 md:mb-0">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold">{booking.hostelName}</h2>
              <p className="text-gray-600">{booking.roomType}</p>
            </div>
            <div className="md:hidden">
              <StatusBadge status={booking.status} />
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
            <div>
              <p className="text-sm text-gray-500">Check-in</p>
              <p className="font-medium">{formatDate(booking.checkInDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Check-out</p>
              <p className="font-medium">{formatDate(booking.checkOutDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Booking ID</p>
              <p className="font-medium">{booking.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Booked on</p>
              <p className="font-medium">{formatDate(booking.bookingDate)}</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-start md:items-end justify-between">
          <div className="hidden md:block mb-4">
            <StatusBadge status={booking.status} />
          </div>
          
          <div className="flex flex-col items-start md:items-end">
            <p className="text-sm text-gray-500">Amount</p>
            <p className="text-xl font-bold">{booking.amount}</p>
            <div className="mt-2">
              <PaymentBadge status={booking.paymentStatus} />
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 border-t pt-4 flex justify-between flex-wrap gap-2">
        <button 
          data-testid={`view-hostel-${booking.id}`}
          onClick={() => router.push(`/hostels/${booking.hostelId}`)}
          className="flex items-center text-blue-500 hover:underline"
        >
          <FiExternalLink className="mr-1" />
          View Hostel
        </button>
        
        <div className="space-x-2">
          <button 
            data-testid={`download-receipt-${booking.id}`}
            className="bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-50 transition-colors"
          >
            <FiDownload className="inline mr-1" />
            Receipt
          </button>
          
          {booking.status === 'upcoming' && (
            <button 
              data-testid={`cancel-booking-${booking.id}`}
              className="bg-red-50 text-red-700 border border-red-300 px-3 py-1 rounded-md hover:bg-red-100 transition-colors"
            >
              Cancel Booking
            </button>
          )}
          
          {booking.status === 'active' && (
            <button 
              data-testid={`extend-stay-${booking.id}`}
              className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors"
            >
              Extend Stay
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
