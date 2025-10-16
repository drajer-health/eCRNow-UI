import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import axiosInstance from "../../Services/AxiosConfig";
import PublicHealthAuthorityList from "./PublicHealthAuthorityList";
import { toast } from "react-toastify";

vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
  },
}));

vi.mock("@mui/icons-material/Edit", () => ({
  default: () => <span>EditIcon</span>,
}));

vi.mock("../../withRouter", () => ({
  withRouter: (component: React.FC) => component,
}));

describe("PublicHealthAuthorityList", () => {
  const mockAddNew = vi.fn();
  const mockSelectPHA = vi.fn();
  const mockNavigate = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("fetches and displays public health authorities", async () => {
    const mockData = [
      {
        id: 1,
        clientId: "client1",
        fhirServerBaseURL: "http://fhir1.com",
        authType: "OAuth",
      },
      {
        id: 2,
        clientId: "client2",
        fhirServerBaseURL: "http://fhir2.com",
        authType: "Basic",
      },
    ];

    vi.spyOn(axiosInstance, "get").mockResolvedValue({
      status: 200,
      data: mockData,
    });

    render(
      <PublicHealthAuthorityList
        addNewPublicHealthAuthority={mockAddNew}
        selectedPublicHealthAuthority={mockSelectPHA}
        navigate={mockNavigate}
      />
    );

    for (const pha of mockData) {
      await waitFor(() => {
        expect(screen.getByText(pha.clientId)).toBeInTheDocument();
        expect(screen.getByText(pha.fhirServerBaseURL)).toBeInTheDocument();
        expect(screen.getByText(pha.authType)).toBeInTheDocument();
      });
    }
  });

  it("handles error response status not 200", async () => {
    const mockToastError = toast.error;
    vi.spyOn(axiosInstance, "get").mockResolvedValue({
      status: 500,
    });

    render(
      <PublicHealthAuthorityList
        addNewPublicHealthAuthority={mockAddNew}
        selectedPublicHealthAuthority={mockSelectPHA}
        navigate={mockNavigate}
      />
    );

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(
        "Error in getting the PublicHealthAuthorities",
        expect.any(Object)
      );
    });
  });

  it("handles axios get failure", async () => {
  const originalConsoleError = console.error;
  console.error = vi.fn();

  try {
    const mockToastError = toast.error;
    vi.spyOn(axiosInstance, "get").mockRejectedValue(
      new Error("Network Error")
    );

    render(
      <PublicHealthAuthorityList
        addNewPublicHealthAuthority={mockAddNew}
        selectedPublicHealthAuthority={mockSelectPHA}
        navigate={mockNavigate}
      />
    );

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(
        "Error in getting the PublicHealthAuthorities",
        expect.any(Object)
      );
    });
  } finally {
    console.error = originalConsoleError;
  }
});

  it("clicking 'Add New Public Health Authority' triggers handlers and navigation", async () => {
    vi.spyOn(axiosInstance, "get").mockResolvedValue({ status: 200, data: [] });

    render(
      <PublicHealthAuthorityList
        addNewPublicHealthAuthority={mockAddNew}
        selectedPublicHealthAuthority={mockSelectPHA}
        navigate={mockNavigate}
      />
    );

    const addButton = screen.getByRole("button", {
      name: /Add New Public Health Authority/i,
    });
    await userEvent.click(addButton);

    expect(mockAddNew).toHaveBeenCalledWith({ addNewHealthCare: true });
    expect(mockSelectPHA).toHaveBeenCalledWith({});
    expect(mockNavigate).toHaveBeenCalledWith("/publicHealthAuthority");
  });

  it("clicking edit button triggers handlers and navigation", async () => {
    const mockData = [
      {
        id: 1,
        clientId: "client1",
        fhirServerBaseURL: "http://fhir1.com",
        authType: "OAuth",
      },
    ];

    vi.spyOn(axiosInstance, "get").mockResolvedValue({
      status: 200,
      data: mockData,
    });

    render(
      <PublicHealthAuthorityList
        addNewPublicHealthAuthority={mockAddNew}
        selectedPublicHealthAuthority={mockSelectPHA}
        navigate={mockNavigate}
      />
    );

    const editButton = await screen.findByRole("button", { name: /Edit/i });

    await userEvent.click(editButton);

    expect(mockAddNew).toHaveBeenCalledWith({
      addNewPublicHealthAuthority: false,
    });
    expect(mockSelectPHA).toHaveBeenCalledWith(mockData[0]);
    expect(mockNavigate).toHaveBeenCalledWith("/publicHealthAuthority");
  });
});
