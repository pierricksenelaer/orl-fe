export interface UserProfile {
    id: string;
    userPreference?: {
      avatar?: string;
    };
    // Add other user profile fields as needed
  }
  
  export interface Notification {
    id: string;
    message: string;
    createdAt: Date;
    // Add other notification fields as needed
  }