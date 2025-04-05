import { render, screen, } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach,Mock } from "vitest";
import UserDirectory from "../../component/UserDirectory";
import { useUserContext } from "../../context/UserContext";
vi.mock("../../context/UserContext", () => ({
    useUserContext: vi.fn(),
  }));
  
  describe("UserDirectory", () => {
    const mockSearchByName = vi.fn();
    const mockFilterByCity = vi.fn();
    const mockToggleHighlightOldest = vi.fn();
  
    // Provide a mock cities array and valid users data for filteredUsers
    const cities = ["New York", "Los Angeles", "Chicago"];
    const filteredUsers = [
      { id: 1, firstName: "John", lastName: "Doe", city: "New York" },
      { id: 2, firstName: "Jane", lastName: "Doe", city: "Los Angeles" }
    ];
  
    beforeEach(() => {
      // Reset mock functions before each test
      mockSearchByName.mockClear();
      mockFilterByCity.mockClear();
      mockToggleHighlightOldest.mockClear();
    });
  
    it("renders loading state", () => {
      // Mock the context values for loading state
      (useUserContext as Mock).mockReturnValue({
        loading: true,
        error: null,
        searchByName: mockSearchByName,
        filterByCity: mockFilterByCity,
        toggleHighlightOldest: mockToggleHighlightOldest,
        highlightOldest: false,
        cities, 
      });
  
      render(<UserDirectory />);
  
      // Check if loading state is rendered
      expect(screen.getByText(/Loading user data.../i)).toBeInTheDocument();
    });
  
    it("renders error state", () => {
      // Mock the context values for error state
      (useUserContext as Mock).mockReturnValue({
        loading: false,
        error: "Failed to load data",
        searchByName: mockSearchByName,
        filterByCity: mockFilterByCity,
        toggleHighlightOldest: mockToggleHighlightOldest,
        highlightOldest: false,
        cities, 
      });
  
      render(<UserDirectory />);
  
      // Check if the error message is rendered
      expect(screen.getByText(/Error: Failed to load data/i)).toBeInTheDocument();
    });
  
    it("renders the SearchFilters and UserTable components when data is loaded", () => {
      // Mock the context values for success state
      (useUserContext as Mock).mockReturnValue({
        loading: false,
        error: null,
        searchByName: mockSearchByName,
        filterByCity: mockFilterByCity,
        toggleHighlightOldest: mockToggleHighlightOldest,
        highlightOldest: false,
        cities, 
        filteredUsers, 
      });
  
      render(<UserDirectory />);
  
      // Check if SearchFilters and UserTable are rendered
      expect(screen.getByTestId("search-input")).toBeInTheDocument();
      expect(screen.getByTestId("city-select")).toBeInTheDocument();
      expect(screen.getByTestId("highlight-checkbox")).toBeInTheDocument();

    });
  });
  