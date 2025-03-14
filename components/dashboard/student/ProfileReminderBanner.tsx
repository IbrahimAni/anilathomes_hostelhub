import { FiUser } from "react-icons/fi";

interface ProfileReminderBannerProps {
  onCompleteProfile: () => void;
}

export const ProfileReminderBanner: React.FC<ProfileReminderBannerProps> = ({ 
  onCompleteProfile 
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-indigo-700 p-4 shadow-lg z-50" data-testid="profile-reminder-banner">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-white/20 p-2 rounded-full mr-3">
            <FiUser className="text-white" size={20} />
          </div>
          <p className="text-white text-sm">
            <span className="font-semibold">Your profile is incomplete.</span> Complete your profile for the full HostelHub experience.
          </p>
        </div>
        <button 
          onClick={onCompleteProfile}
          className="px-4 py-2 bg-white text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-50 ml-3 whitespace-nowrap"
        >
          Complete Now
        </button>
      </div>
    </div>
  );
};