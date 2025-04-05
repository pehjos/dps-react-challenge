import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi, Mock } from "vitest"; 
import UserTable from "../../component/UserTable"; 
import { User } from "../../types/contextTpes";


vi.mock("../../context/UserContext", () => ({
  useUserContext: vi.fn()
}));


import { useUserContext } from "../../context/UserContext";

// Sample user data
const mockUsers: User[] = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    address: { city: "New York" },
    birthDate: "1990-05-15",
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    address: { city: "Boston" },
    birthDate: "1985-07-20",
  },
  {
    id: 3,
    firstName: "Bob",
    lastName: "Johnson",
    address: { city: "New York" },
    birthDate: "1980-01-10",
  }
];

describe("UserTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render a table with user data", () => {
    // Set up the mock implementation for this test
    (useUserContext as Mock).mockReturnValue({
      filteredUsers: mockUsers,
      highlightOldest: false
    });

    render(<UserTable />);
    
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("City")).toBeInTheDocument();
    expect(screen.getByText("Birthday")).toBeInTheDocument();

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("Bob Johnson")).toBeInTheDocument();
    
    expect(screen.getAllByText("New York")).toHaveLength(2);
    expect(screen.getByText("Boston")).toBeInTheDocument();
    
    expect(screen.getByText("15.05.1990")).toBeInTheDocument();
    expect(screen.getByText("20.07.1985")).toBeInTheDocument();
    expect(screen.getByText("10.01.1980")).toBeInTheDocument();
  });

  it("should display a message when no users match criteria", () => {
   
    (useUserContext as Mock).mockReturnValue({
      filteredUsers: [],
      highlightOldest: false
    });

    render(<UserTable />);

    expect(screen.getByText("No users found matching your criteria")).toBeInTheDocument();
  });

  it("should highlight the oldest user in each city when enabled", () => {
    (useUserContext as Mock).mockReturnValue({
      filteredUsers: mockUsers,
      highlightOldest: true
    });

    const { container } = render(<UserTable />);

   
    const highlightedRows = container.querySelectorAll(".bg-orange-100");
    expect(highlightedRows).toHaveLength(2); // One for each city
    
    // Bob is the oldest in New York
    const bobRow = screen.getByText("Bob Johnson").closest("tr");
    expect(bobRow).toHaveClass("bg-orange-100");
    
   
    const janeRow = screen.getByText("Jane Smith").closest("tr");
    expect(janeRow).toHaveClass("bg-orange-100");
    
 
    const johnRow = screen.getByText("John Doe").closest("tr");
    expect(johnRow).not.toHaveClass("bg-orange-100");
  });

  it("should not highlight Mock users when highlighting is disabled", () => {
   
    (useUserContext as Mock).mockReturnValue({
      filteredUsers: mockUsers,
      highlightOldest: false
    });

    const { container } = render(<UserTable />);

    // Check that no rows are highlighted
    const highlightedRows = container.querySelectorAll(".bg-orange-100");
    expect(highlightedRows).toHaveLength(0);
  });

  it("should properly format dates in DD.MM.YYYY format", () => {
    (useUserContext as Mock).mockReturnValue({
      filteredUsers: [
        {
          id: 4,
          firstName: "Alice",
          lastName: "Wonder",
          address: { city: "Chicago" },
          birthDate: "2000-12-01",
          age: 23
        },
        {
          id: 5,
          firstName: "Charlie",
          lastName: "Brown",
          address: { city: "Denver" },
          birthDate: "1995-01-05",
          age: 28
        }
      ],
      highlightOldest: false
    });

    render(<UserTable />);

    expect(screen.getByText("01.12.2000")).toBeInTheDocument();
    expect(screen.getByText("05.01.1995")).toBeInTheDocument();
  });

  it("should compare birth dates correctly to find oldest users", () => {
    const usersWithSimilarAges = [
      {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        address: { city: "New York" },
        birthDate: "1990-01-15", 
        age: 33
      },
      {
        id: 2,
        firstName: "Jane",
        lastName: "Smith",
        address: { city: "New York" },
        birthDate: "1990-06-20", 
        age: 33
      }
    ];

    (useUserContext as Mock).mockReturnValue({
      filteredUsers: usersWithSimilarAges,
      highlightOldest: true
    });

render(<UserTable />);
  
    const johnRow = screen.getByText("John Doe").closest("tr");
    expect(johnRow).toHaveClass("bg-orange-100");

    const janeRow = screen.getByText("Jane Smith").closest("tr");
    expect(janeRow).not.toHaveClass("bg-orange-100");
  });
});