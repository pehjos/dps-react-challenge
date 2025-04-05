import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {User, UserContextType} from "../types/contextTpes"; 

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [nameFilter, setNameFilter] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [highlightOldest, setHighlightOldest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cities, setCities] = useState<string[]>([]);


  useEffect(() => {
    const fetchUsers = async (): Promise<void> => {
      try {
        setLoading(true);
        const response = await fetch("https://dummyjson.com/users");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data.users);
        setFilteredUsers(data.users);
        
     
        const uniqueCities = Array.from(
          new Set(data.users.map((user: User) => user.address.city))
        ).sort() as string[];
        setCities(uniqueCities);
        
        setLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);


  useEffect(() => {
    const applyFilters = (): void => {
      let result = [...users];

      // Filter by name
      if (nameFilter) {
        const searchTerm = nameFilter.toLowerCase();
        result = result.filter(
          (user) =>
            user.firstName.toLowerCase().includes(searchTerm) ||
            user.lastName.toLowerCase().includes(searchTerm)
        );
      }

      // Filter by city
      if (selectedCity) {
        result = result.filter(
          (user) => user.address.city === selectedCity
        );
      }

      setFilteredUsers(result);
    };


    const timeoutId = setTimeout(applyFilters, 1000);
    return () => clearTimeout(timeoutId);
  }, [nameFilter, selectedCity, users]);

  const searchByName = (name: string): void => {
    setNameFilter(name);
  };

  const filterByCity = (city: string): void => {
    setSelectedCity(city);
  };

  const toggleHighlightOldest = (): void => {
    setHighlightOldest(!highlightOldest);
  };

  return (
    <UserContext.Provider
      value={{
        users,
        filteredUsers,
        loading,
        error,
        cities,
        searchByName,
        filterByCity,
        highlightOldest,
        toggleHighlightOldest,
        selectedCity
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};