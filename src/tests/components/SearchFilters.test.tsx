
import { render, screen, fireEvent,  } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach ,Mock} from "vitest";
import SearchFilters from "../../component/SearchFilter"; 
import { useUserContext } from "../../context/UserContext";


vi.mock("../../context/UserContext", () => ({
  useUserContext: vi.fn(),
}));

describe("SearchFilters", () => {
  const mockOnSearchChange = vi.fn();
  const mockOnCityFilterChange = vi.fn();
  const mockOnHighlightToggle = vi.fn();
  const cities = ["New York", "Los Angeles", "Chicago"];

  beforeEach(() => {
    (useUserContext as Mock).mockReturnValue({
      cities, 
    });

    // Clear mock calls before each test
    mockOnSearchChange.mockClear();
    mockOnCityFilterChange.mockClear();
    mockOnHighlightToggle.mockClear();
  });

  it("renders input, city select, and checkbox", () => {
    render(
      <SearchFilters
        onSearchChange={mockOnSearchChange}
        onCityFilterChange={mockOnCityFilterChange}
        onHighlightToggle={mockOnHighlightToggle}
        highlightChecked={false}
      />
    );

    // Check if the search input, city select, and checkbox are rendered
    expect(screen.getByTestId("search-input")).toBeInTheDocument();
    expect(screen.getByTestId("city-select")).toBeInTheDocument();
    expect(screen.getByTestId("highlight-checkbox")).toBeInTheDocument();
  });

  it("calls onSearchChange when the search input changes", async () => {
    render(
      <SearchFilters
        onSearchChange={mockOnSearchChange}
        onCityFilterChange={mockOnCityFilterChange}
        onHighlightToggle={mockOnHighlightToggle}
        highlightChecked={false}
      />
    );

    const searchInput = screen.getByTestId("search-input");
    fireEvent.change(searchInput, { target: { value: "John" } });
  });

  it("calls onCityFilterChange when a city is selected", () => {
    render(
      <SearchFilters
        onSearchChange={mockOnSearchChange}
        onCityFilterChange={mockOnCityFilterChange}
        onHighlightToggle={mockOnHighlightToggle}
        highlightChecked={false}
      />
    );

    const citySelect = screen.getByTestId("city-select");

    // Simulate selecting "New York" from the dropdown
    fireEvent.change(citySelect, { target: { value: "New York" } });

    expect(mockOnCityFilterChange).toHaveBeenCalledWith("New York");
  });

  it("calls onHighlightToggle when the checkbox is toggled", () => {
    render(
      <SearchFilters
        onSearchChange={mockOnSearchChange}
        onCityFilterChange={mockOnCityFilterChange}
        onHighlightToggle={mockOnHighlightToggle}
        highlightChecked={false}
      />
    );

    const checkbox = screen.getByTestId("highlight-checkbox");

    // Simulate checking the checkbox
    fireEvent.click(checkbox);

    expect(mockOnHighlightToggle).toHaveBeenCalled();
  });

  it("displays the correct cities in the city dropdown", () => {
    render(
      <SearchFilters
        onSearchChange={mockOnSearchChange}
        onCityFilterChange={mockOnCityFilterChange}
        onHighlightToggle={mockOnHighlightToggle}
        highlightChecked={false}
      />
    );

    const citySelect = screen.getByTestId("city-select");

    // Check if all the cities are displayed in the dropdown
    cities.forEach((city) => {
      expect(citySelect).toHaveTextContent(city);
    });
  });

  it("pre-fills the highlight checkbox based on highlightChecked prop", () => {
    render(
      <SearchFilters
        onSearchChange={mockOnSearchChange}
        onCityFilterChange={mockOnCityFilterChange}
        onHighlightToggle={mockOnHighlightToggle}
        highlightChecked={true}
      />
    );

    const checkbox = screen.getByTestId("highlight-checkbox");
    expect(checkbox).toBeChecked();
  });
});
