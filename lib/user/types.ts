export interface User {
  id: string;
  name: string;
}

export interface UserIdentificationMethod {
  id: string;
  name: string;
  Component: React.ComponentType<{
    onSelect: (user: User) => void;
    disabled?: boolean;
  }>;
}

export interface UserResponse {
  points: {
    total: number;
    history: Array<{
      points: number;
      reason: string;
      author: {
        id: string;
        name: string;
        role: string;
      };
      timestamp: Date;
    }>;
  };
  attendance: Array<{
    event: {
      id: number;
      name: string;
      description: string;
      startTime: Date;
      endTime: Date;
      type: "workshop" | "meal" | "activity";
    };
    attended: boolean;
    checkInTime?: Date;
  }>;
}
