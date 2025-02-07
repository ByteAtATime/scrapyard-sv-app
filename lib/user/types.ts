export interface User {
  id: number;
  name: string;
  email: string;
  authProvider: string;
  authProviderId: string;
  totalPoints: number;
  isOrganizer: boolean;
}

export interface UserIdentificationMethod {
  id: string;
  name: string;
  Component: React.ComponentType<{
    onSelect: (user: User) => void;
    disabled?: boolean;
  }>;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export type UsersListResponse = ApiResponse<User[]>;
export type UserResponse = ApiResponse<User>;
