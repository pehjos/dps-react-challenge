import React from "react";
import { useUserContext } from "../context/UserContext";
import UserTable from "./UserTable";
import SearchFilters from "./SearchFilter";
const UserDirectory: React.FC = () => {
  const { 
    loading, 
    error, 
    searchByName, 
    filterByCity, 
    toggleHighlightOldest,
    highlightOldest
  } = useUserContext();

  if (loading) {
    return <div className="text-center py-8 h-[100vh] flex items-center justify-center">
      <span className="loader"></span>
    Loading user data...
    </div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="user-directory p-6 bg-orange-200">
      <h1 className="text-2xl font-bold mb-4">User Directory</h1>
  
      <SearchFilters 
        onSearchChange={searchByName} 
        onCityFilterChange={filterByCity} 
        onHighlightToggle={toggleHighlightOldest}
        highlightChecked={highlightOldest}
      />
      
      <UserTable />
    </div>
  );
};

export default UserDirectory;