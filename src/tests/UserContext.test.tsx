
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { UserProvider, useUserContext } from "../context/UserContext"; 

// Mock fetch API
const mockUsers = {
  users: [
    {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      address: { city: "New York" },
      age: 30
    },
    {
      id: 2,
      firstName: "Jane",
      lastName: "Smith",
      address: { city: "Boston" },
      age: 25
    },
    {
      id: 3,
      firstName: "Bob",
      lastName: "Johnson",
      address: { city: "New York" },
      age: 45
    }
  ]
};

// Helper component to test the context
const TestComponent = (): JSX.Element => {
  const {
    filteredUsers,
    loading,
    error,
    cities,
    searchByName,
    filterByCity,
    highlightOldest,
    toggleHighlightOldest,
    selectedCity
  } = useUserContext();

  return (
    <div>
      {loading && <div data-testid="loading">Loading...</div>}
      {error && <div data-testid="error">{error}</div>}
      
      <button data-testid="highlight-toggle" onClick={toggleHighlightOldest}>
        {highlightOldest ? "Disable Highlight" : "Enable Highlight"}
      </button>
      
      <select 
        data-testid="city-select" 
        value={selectedCity} 
        onChange={(e) => filterByCity(e.target.value)}
      >
        <option value="">All Cities</option>
        {cities.map(city => (
          <option key={city} value={city}>{city}</option>
        ))}
      </select>
      
      <input
        data-testid="name-filter"
        type="text"
        placeholder="Search by name"
        onChange={(e) => searchByName(e.target.value)}
      />
      
      <ul data-testid="user-list">
        {filteredUsers.map(user => (
          <li key={user.id} data-testid={`user-${user.id}`}>
            {user.firstName} {user.lastName} - {user.address.city}
          </li>
        ))}
      </ul>
    </div>
  );
};

describe("UserProvider", () => {
  beforeEach(() => {
    // Mock fetch global
    globalThis.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUsers)
      })
    );
  });

  it("should fetch and display users on mount", async () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    // Should show loading initially
    expect(screen.getByTestId("loading")).toBeInTheDocument();

    // Wait for users to load
    await waitFor(() => {
      expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
    });

    // Should display all users
    expect(screen.getAllByTestId(/user-\d+/)).toHaveLength(3);
    expect(screen.getByText("John Doe - New York")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith - Boston")).toBeInTheDocument();
    expect(screen.getByText("Bob Johnson - New York")).toBeInTheDocument();
  });

  it("should filter users by name", async () => {
    const user = userEvent.setup();
    
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    // Wait for users to load
    await waitFor(() => {
      expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
    });

    // Type in the name filter
    await user.type(screen.getByTestId("name-filter"), "john");

    // Wait for the debounce timeout
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 1100));
    });

    // Should only show users with "john" in their name
    expect(screen.getAllByTestId(/user-\d+/)).toHaveLength(2);
    expect(screen.getByText("John Doe - New York")).toBeInTheDocument();
    expect(screen.getByText("Bob Johnson - New York")).toBeInTheDocument();
    expect(screen.queryByText("Jane Smith - Boston")).not.toBeInTheDocument();
  });

  it("should filter users by city", async () => {
    const user = userEvent.setup();
    
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    // Wait for users to load
    await waitFor(() => {
      expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
    });

    // Select a city from the dropdown
    await user.selectOptions(screen.getByTestId("city-select"), "Boston");

    // Wait for the debounce timeout
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 1100));
    });

    // Should only show users from Boston
    expect(screen.getAllByTestId(/user-\d+/)).toHaveLength(1);
    expect(screen.getByText("Jane Smith - Boston")).toBeInTheDocument();
    expect(screen.queryByText("John Doe - New York")).not.toBeInTheDocument();
    expect(screen.queryByText("Bob Johnson - New York")).not.toBeInTheDocument();
  });

  it("should toggle highlight oldest feature", async () => {
    const user = userEvent.setup();
    
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    // Wait for users to load
    await waitFor(() => {
      expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
    });

    // Check initial state
    expect(screen.getByTestId("highlight-toggle")).toHaveTextContent("Enable Highlight");

    // Click the toggle button
    await user.click(screen.getByTestId("highlight-toggle"));

    // Check if the state updated
    expect(screen.getByTestId("highlight-toggle")).toHaveTextContent("Disable Highlight");
  });

  it("should handle API error", async () => {
    // Override the mock to return an error
    globalThis.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: false,
        status: 500
      })
    );

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByTestId("error")).toBeInTheDocument();
      expect(screen.getByTestId("error")).toHaveTextContent("Failed to fetch users");
    });
  });

  it("should handle fetch exception", async () => {
    // Override the mock to throw an exception
    globalThis.fetch = vi.fn().mockImplementation(() => {
      throw new Error("Network error");
    });

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByTestId("error")).toBeInTheDocument();
      expect(screen.getByTestId("error")).toHaveTextContent("Network error");
    });
  });

  it("should combine name and city filters", async () => {
    const user = userEvent.setup();
    
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );
  
    // Wait for users to load
    await waitFor(() => {
      expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
    });
  
    // Select New York from the dropdown
    await user.selectOptions(screen.getByTestId("city-select"), "New York");
    
    // Type "john" in the name filter
    await user.type(screen.getByTestId("name-filter"), "john");
  
    // Wait for the debounce timeout
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 1100));
    });
  
    // Should show both John Doe and Bob Johnson from New York 
    // since "john" matches both "John" and "Johnson"
    expect(screen.getAllByTestId(/user-\d+/)).toHaveLength(2);
    expect(screen.getByText("John Doe - New York")).toBeInTheDocument();
    expect(screen.getByText("Bob Johnson - New York")).toBeInTheDocument();
    expect(screen.queryByText("Jane Smith - Boston")).not.toBeInTheDocument();
  });
  it("should verify correct cities are extracted and sorted", async () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    // Wait for users to load
    await waitFor(() => {
      expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
    });

    // Check if the cities are correctly extracted and sorted
    const cityOptions = Array.from(screen.getByTestId("city-select").querySelectorAll("option"))
      .filter(option => option.value !== "")
      .map(option => option.textContent);
    
    expect(cityOptions).toEqual(["Boston", "New York"]);
  });

  it("should throw error when useUserContext is used outside provider", () => {
    // Silence error console during this test
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    
    // Expect the component to throw an error
    expect(() => render(<TestComponent />)).toThrow("useUserContext must be used within a UserProvider");
    
    // Restore console.error
    consoleSpy.mockRestore();
  });
  
});