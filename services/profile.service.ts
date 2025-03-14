import { UserProfile } from "@/types/user";

export class ProfileService {
  /**
   * Check if a user profile is complete by validating required fields
   * @param user User profile to check
   * @returns Object containing completion status and any missing fields
   */
  static getProfileStatus(user: UserProfile | null) {
    if (!user) return { isComplete: false, missingFields: [] };
    
    const missingFields = [];
    if (!user.displayName) missingFields.push('displayName');
    if (!user.university) missingFields.push('university');
    if (!user.department) missingFields.push('department');
    if (!user.level) missingFields.push('level');
    
    return {
      isComplete: missingFields.length === 0,
      missingFields
    };
  }

  /**
   * Calculate profile completion percentage based on required fields
   * @param user User profile to calculate completion for
   * @returns Percentage of profile completion (0-100)
   */
  static getCompletionPercentage(user: UserProfile | null): number {
    if (!user) return 0;
    
    const { missingFields } = this.getProfileStatus(user);
    const totalRequiredFields = 4; // displayName, university, department, level
    
    return Math.round((totalRequiredFields - missingFields.length) / totalRequiredFields * 100);
  }
}