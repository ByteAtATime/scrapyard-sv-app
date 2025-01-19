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
