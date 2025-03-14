import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiBell } from "react-icons/fi";
import { ActivityService, Activity } from "@/services/activity.service";

interface RecentActivityProps {
  limit?: number;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ 
  limit = 3
}) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const recentActivities = await ActivityService.getRecentActivities(limit);
        setActivities(recentActivities);
      } catch (error) {
        console.error("Error fetching recent activities:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchActivities();
  }, [limit]);
  
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-center h-60">
        <div className="w-8 h-8 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }
  
  const hasActivity = activities.length > 0;
  
  // Helper function to format the timestamp as relative time
  const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return "1 week ago";
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 60) return "1 month ago";
    return `${Math.floor(diffDays / 30)} months ago`;
  };
  
  // Get the appropriate border color based on activity type
  const getBorderColorClass = (type: Activity['type']): string => {
    switch (type) {
      case 'booking': return 'border-blue-500 bg-blue-50';
      case 'favorite': return 'border-green-500 bg-green-50';
      case 'payment': return 'border-purple-500 bg-purple-50';
      case 'profile_update': return 'border-yellow-500 bg-yellow-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm" data-testid="recent-activity-section">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Recent Activity</h2>
        {hasActivity && (
          <button 
            className="text-blue-500 hover:text-blue-700 text-sm font-medium"
            data-testid="view-all-activity"
            onClick={() => router.push('/dashboard/student/activity')}
          >
            View All
          </button>
        )}
      </div>
      
      {!hasActivity ? (
        <div className="text-center py-10" data-testid="no-activity">
          <div className="mx-auto w-16 h-16 bg-gray-100 flex items-center justify-center rounded-full mb-3">
            <FiBell className="text-gray-400" size={28} />
          </div>
          <p className="text-gray-500 mb-2">No recent activity</p>
          <p className="text-sm text-gray-400">
            Your recent activity will appear here after you start using HostelHub
          </p>
          <button 
            onClick={() => router.push('/hostels')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
            data-testid="explore-hostels-button"
          >
            Start Exploring Hostels
          </button>
        </div>
      ) : (
        <div className="space-y-4" data-testid="activity-list">
          {activities.map((activity) => (
            <div 
              key={activity.id} 
              className={`border-l-4 p-4 rounded-lg ${getBorderColorClass(activity.type)}`} 
              data-testid={`activity-item-${activity.id}`}
            >
              <p className="font-medium">{activity.title}</p>
              <p className="text-sm text-gray-600">{formatRelativeTime(activity.timestamp)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};