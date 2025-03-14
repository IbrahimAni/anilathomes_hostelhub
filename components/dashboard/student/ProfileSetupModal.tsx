import { useRouter } from "next/navigation";
import { FiX, FiUser, FiCheck } from "react-icons/fi";
import { UserProfile } from "@/types/user";

interface ProfileSetupModalProps {
  user: UserProfile | null;
  showModal: boolean;
  profileStatus: {
    isComplete: boolean;
    missingFields: string[];
  };
  dismissModal: () => void;
}

export const ProfileSetupModal: React.FC<ProfileSetupModalProps> = ({ 
  user, 
  showModal, 
  profileStatus, 
  dismissModal 
}) => {
  const router = useRouter();
  
  // Navigate to profile page
  const goToProfile = () => {
    router.push('/dashboard/student/profile');
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/70 flex items-center justify-center z-50" data-testid="new-user-overlay">
      <div className="max-w-2xl w-full mx-4 bg-white rounded-xl overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-6 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Welcome to HostelHub!</h2>
            <button 
              onClick={dismissModal}
              className="text-white/80 hover:text-white"
              data-testid="dismiss-overlay"
            >
              <FiX size={24} />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <FiUser size={40} className="text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Complete Your Profile</h3>
              <p className="text-gray-600">
                Before you can explore and book hostels, we need to know your full name and university details. This helps us provide personalized recommendations for you.
              </p>
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg mb-6">
            <h4 className="font-medium text-purple-800 flex items-center gap-2">
              <FiUser size={16} /> Required Information
            </h4>
            <ul className="text-sm text-gray-700 mt-2 space-y-3">
              <li className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <span className="text-purple-500 font-bold">•</span> 
                  <span className="flex-1">Your <strong>full name</strong> helps us personalize your experience</span>
                </span>
                <span className={`flex items-center justify-center w-6 h-6 rounded-full ${user?.displayName ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`} data-testid="name-status">
                  {user?.displayName ? <FiCheck size={14} /> : <FiX size={14} />}
                </span>
              </li>
              <li className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <span className="text-purple-500 font-bold">•</span> 
                  <span className="flex-1">Your <strong>university</strong> helps us show relevant hostels nearby</span>
                </span>
                <span className={`flex items-center justify-center w-6 h-6 rounded-full ${user?.university ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`} data-testid="university-status">
                  {user?.university ? <FiCheck size={14} /> : <FiX size={14} />}
                </span>
              </li>
              <li className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <span className="text-purple-500 font-bold">•</span> 
                  <span className="flex-1">Your <strong>department and level</strong> help with roommate matching</span>
                </span>
                <span className={`flex items-center justify-center w-6 h-6 rounded-full ${user?.department && user?.level ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`} data-testid="dept-level-status">
                  {user?.department && user?.level ? <FiCheck size={14} /> : <FiX size={14} />}
                </span>
              </li>
            </ul>
            
            {/* Profile Completion Progress */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Profile Completion</span>
                <span>
                  {profileStatus.missingFields.length === 0 ? "100%" : 
                   `${Math.round((4 - profileStatus.missingFields.length) / 4 * 100)}%`}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${profileStatus.missingFields.length === 0 ? 100 : Math.round((4 - profileStatus.missingFields.length) / 4 * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <button 
              onClick={goToProfile}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-semibold rounded-lg shadow-md hover:from-purple-700 hover:to-indigo-800 transition-colors"
              data-testid="go-to-profile-button"
            >
              Complete My Profile Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};