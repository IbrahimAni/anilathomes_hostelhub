import { useRouter } from "next/navigation";
import { UserProfile } from "@/types/user";

interface WelcomeSectionProps {
  user: UserProfile | null;
  isNewUser: boolean;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({ user, isNewUser }) => {
  const router = useRouter();
  
  // Navigate to profile page
  const goToProfile = () => {
    router.push('/dashboard/student/profile');
  };

  return (
    <div 
      className={`${
        isNewUser ? "bg-gradient-to-r from-purple-500 to-indigo-700" : "bg-gradient-to-r from-blue-500 to-blue-700"
      } rounded-xl p-8 text-white shadow-lg relative z-10`} 
      data-testid="welcome-section"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2" data-testid="welcome-heading">
            {isNewUser ? `Welcome to HostelHub, ${user?.displayName || 'Student'}` : `Welcome back, ${user?.displayName || 'Student'}`}
          </h1>
          <p className="text-blue-100 max-w-lg">
            {isNewUser 
              ? "Let's get started by completing your profile. Adding your full name helps us personalize your experience."
              : "Your one-stop dashboard for managing your hostel experience. Find, book, and manage your accommodations with ease."
            }
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <button 
            onClick={goToProfile}
            className={`px-5 py-3 ${
              isNewUser ? "bg-white text-purple-700 hover:bg-purple-50 font-bold" : "bg-white text-blue-700 hover:bg-blue-50 font-medium"
            } rounded-lg transition-colors shadow-md relative z-10`}
            data-testid="complete-profile-button"
          >
            {isNewUser ? "Complete Your Profile" : "View Profile"}
          </button>
        </div>
      </div>
      
      {/* Notification banner for new users */}
      {isNewUser && (
        <div className="mt-4 p-3 bg-white/20 rounded-lg flex items-center justify-between">
          <p className="text-white text-sm">
            <span className="font-bold">Complete your profile</span> to see personalized hostel recommendations based on your university.
          </p>
        </div>
      )}
    </div>
  );
};