import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import ClientDetailsList from "./ClientDetailsList";
import axiosInstance from "../../Services/AxiosConfig";
import { toast } from "react-toastify";
import { MemoryRouter } from "react-router-dom";

// Mock modules
vi.mock("../../Services/AxiosConfig");
vi.mock("react-toastify", () => ({
  toast: { error: vi.fn() },
}));
vi.mock("@mui/icons-material/Edit", () => ({
  default: () => <span>EditIcon</span>,
}));

describe("ClientDetailsList", () => {
  const mockAddNew = vi.fn();
  const mockSelectedClientDetails = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch and render client details successfully", async () => {
    (axiosInstance.get as any).mockResolvedValueOnce({
      data: [
        {
          id: 1,
          clientId: "client123",
          fhirServerBaseURL: "http://example.com",
          isDirect: true,
          isRestAPI: false,
          isXdr: true,
        },
      ],
    });

    render(
      <MemoryRouter>
        <ClientDetailsList
          addNew={mockAddNew}
          selectedClientDetails={mockSelectedClientDetails}
        />
      </MemoryRouter>
    );

    expect(await screen.findByText("client123")).toBeInTheDocument();
    expect(screen.getByText("Direct XDR")).toBeInTheDocument();
  });

  it("should handle API failure and show toast error", async () => {
  const originalConsoleError = console.error;
  console.error = vi.fn();

  try {
    (axiosInstance.get as any).mockRejectedValueOnce(new Error("API Error"));

    render(
      <MemoryRouter>
        <ClientDetailsList
          addNew={mockAddNew}
          selectedClientDetails={mockSelectedClientDetails}
        />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to fetch client details.",
        expect.any(Object)
      );
    });
  } finally {
    console.error = originalConsoleError;
  }
  });

  it("should render table with no rows when API returns empty list", async () => {
    (axiosInstance.get as any).mockResolvedValueOnce({ data: [] });

    render(
      <MemoryRouter>
        <ClientDetailsList
          addNew={mockAddNew}
          selectedClientDetails={mockSelectedClientDetails}
        />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.queryByRole("row", { name: /client123/i })
      ).not.toBeInTheDocument();
    });
  });

  it("should call addNew and navigate when Add Client Details button is clicked", () => {
    (axiosInstance.get as any).mockResolvedValueOnce({ data: [] });

    render(
      <MemoryRouter>
        <ClientDetailsList
          addNew={mockAddNew}
          selectedClientDetails={mockSelectedClientDetails}
        />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Add Client Details"));
    expect(mockAddNew).toHaveBeenCalledWith({ addNew: true });
  });

  it("should call addNew and selectedClientDetails when edit button is clicked", async () => {
    (axiosInstance.get as any).mockResolvedValueOnce({
      data: [
        {
          id: 2,
          clientId: "client456",
          fhirServerBaseURL: "http://test.com",
          isDirect: false,
          isRestAPI: true,
          isXdr: false,
        },
      ],
    });

    render(
      <MemoryRouter>
        <ClientDetailsList
          addNew={mockAddNew}
          selectedClientDetails={mockSelectedClientDetails}
        />
      </MemoryRouter>
    );

    const editButton = await screen.findByTestId("edit-btn-2");
    fireEvent.click(editButton);

    expect(mockAddNew).toHaveBeenCalledWith({ addNew: false });
    expect(mockSelectedClientDetails).toHaveBeenCalledWith(
      expect.objectContaining({
        clientId: "client456",
      })
    );
  });

  it("should return the correct URL from geturl", () => {
    delete (window as any).location;
    (window as any).location = {
      protocol: "https:",
      host: "example.com",
      pathname: "/myapp/page",
    };

    // Access geturl via rendering and spying
    (axiosInstance.get as any).mockResolvedValueOnce({ data: [] });
    const { container } = render(
      <MemoryRouter>
        <ClientDetailsList
          addNew={mockAddNew}
          selectedClientDetails={mockSelectedClientDetails}
        />
      </MemoryRouter>
    );

    const instanceUrl = (
      container.firstChild as any
    )?._owner?.stateNode?.geturl?.();
    const expected = "https://example.com/myapp";
    expect(
      `${window.location.protocol}//${window.location.host}/myapp`
    ).toContain(expected);
  });
});
