
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  address: {
    city: string;
  };
}

export interface UserContextType {
  users: User[];
  filteredUsers: User[];
  loading: boolean;
  error: string | null;
  cities: string[];
  searchByName: (name: string) => void;
  filterByCity: (city: string) => void;
  highlightOldest: boolean;
  toggleHighlightOldest: () => void;
  selectedCity: string;
}
