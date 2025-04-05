import React, { useMemo } from "react";
import {  useUserContext } from "../context/UserContext";
import {User} from "../types/contextTpes"; 
const UserTable: React.FC = () => {
  const { filteredUsers, highlightOldest } = useUserContext();

  // Find the oldest user in each city
  const oldestUsersByCity = useMemo(() => {
    if (!highlightOldest) return {};
    
    const cityGroups: Record<string, User[]> = {};
    
    // Group users by city
    filteredUsers.forEach(user => {
      const city = user.address.city;
      if (!cityGroups[city]) {
        cityGroups[city] = [];
      }
      cityGroups[city].push(user);
    });
    
    // Find the oldest user in each city
    const oldestUsers: Record<string, number> = {};
    
    Object.entries(cityGroups).forEach(([city, users]) => {
      const oldest = users.reduce((oldestSoFar, currentUser) => {
        const oldestDate = new Date(oldestSoFar.birthDate);
        const currentDate = new Date(currentUser.birthDate);
        return currentDate < oldestDate ? currentUser : oldestSoFar;
      }, users[0]);
      
      oldestUsers[city] = oldest.id;
    });
    
    return oldestUsers;
  }, [filteredUsers, highlightOldest]);

  // Format date to display as shown in mockup (DD.MM.YYYY)
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const isOldestInCity = (user: User): boolean => {
    return highlightOldest && oldestUsersByCity[user.address.city] === user.id;
  };

  return (
    <div className="relative overflow-x-auto">
  <div className="max-h-[500px] overflow-y-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50 sticky top-0 z-10">
        <tr>
          <th className="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
            Name
          </th>
          <th className="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
            City
          </th>
          <th className="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
            Birthday
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {filteredUsers.length === 0 ? (
          <tr>
            <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
              No users found matching your criteria
            </td>
          </tr>
        ) : (
          filteredUsers.map((user) => (
            <tr 
              key={user.id} 
              className={isOldestInCity(user) ? "bg-orange-100 border-3 border-orange-400 my-2 rounded-lg" : "py-3 my-2"}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                {user.firstName} {user.lastName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {user.address?.city}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {formatDate(user.birthDate)}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
</div>
  );
};

export default UserTable;