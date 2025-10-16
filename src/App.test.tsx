import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

describe("App", () => {
  it("renders the app title", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: /ecrnow/i })
    ).toBeInTheDocument();
  });
});

 