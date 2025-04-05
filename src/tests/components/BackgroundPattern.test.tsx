import { render, screen } from "@testing-library/react";
import { BackgroundPattern } from "../../component/BackgroundPattern"; 
import {describe, it, expect } from "vitest";

describe("BackgroundPattern", () => {
  it("renders the background pattern", () => {
    render(<BackgroundPattern />);
const backgroundPattern = screen.getByTestId("background-pattern");
    expect(backgroundPattern).toBeInTheDocument();

  
    const gridPattern = screen.getByTestId("grid-pattern");
    expect(gridPattern).toBeInTheDocument();


    const accentShapes = screen.getAllByTestId("accent-shape");
    expect(accentShapes.length).toBe(3); 

 
    const icons = screen.getAllByTestId("icon");
    expect(icons.length).toBe(4);
  });

  it("should contain correct icon elements", () => {
    render(<BackgroundPattern />);


    const globeIcon = screen.getAllByTestId("icon")[0];
    expect(globeIcon).toBeInTheDocument();

    const mapPinIcon = screen.getAllByTestId("icon")[1];
    expect(mapPinIcon).toBeInTheDocument();

    const searchIcon = screen.getAllByTestId("icon")[2];
    expect(searchIcon).toBeInTheDocument();

    const secondGlobeIcon = screen.getAllByTestId("icon")[3];
    expect(secondGlobeIcon).toBeInTheDocument();
  });
});
