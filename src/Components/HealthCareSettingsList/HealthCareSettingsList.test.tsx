import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { toast } from "react-toastify";
import { expect, it, vi } from "vitest";
import axiosInstance from "../../Services/AxiosConfig";
import HealthCareSettingsList from "./HealthCareSettingsList";

// Mocks
vi.mock("../../Services/AxiosConfig", () => ({
  default: {
    get: vi.fn(),
  },
}));

vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
  },
}));

vi.mock("../../withRouter", async () => {
  const actual = await vi.importActual<any>("../../withRouter");
  const mockNavigate = vi.fn();
  const mockAddNewHealthCare = vi.fn();
  const mockSelectedHealthCareSettings = vi.fn();

  (globalThis as any).mockNavigate = mockNavigate;
  (globalThis as any).mockAddNewHealthCare = mockAddNewHealthCare;
  (globalThis as any).mockSelectedHealthCareSettings =
    mockSelectedHealthCareSettings;

  return {
    ...actual,
    withRouter: (Component: any) => (props: any) =>
      (
        <Component
          {...props}
          navigate={mockNavigate}
          addNewHealthCare={mockAddNewHealthCare}
          selectedHealthCareSettings={mockSelectedHealthCareSettings}
        />
      ),
  };
});

const renderComponent = (propsOverride = {}) => {
  const mockProps = {
    addNewHealthCare: vi.fn(),
    selectedHealthCareSettings: vi.fn(),
    navigate: vi.fn(),
    ...propsOverride,
  };

  return render(
    <BrowserRouter>
      <HealthCareSettingsList {...mockProps} />
    </BrowserRouter>
  );
};

it("renders healthcare settings rows on successful fetch", async () => {
  const mockData = [
    {
      id: "1",
      clientId: "ABC123",
      fhirServerBaseURL: "https://example.com/fhir",
      authType: "Basic",
    },
  ];

  (axiosInstance.get as any).mockResolvedValueOnce({
    status: 200,
    data: mockData,
  });

  renderComponent();

  await waitFor(() => {
    expect(screen.getByText("ABC123")).toBeInTheDocument();
    expect(screen.getByText("https://example.com/fhir")).toBeInTheDocument();
    expect(screen.getByText("Basic")).toBeInTheDocument();
  });
});

it("shows error toast on failed API call", async () => {
  const originalConsoleError = console.error;
  console.error = vi.fn();

  vi.spyOn(toast, 'error').mockImplementation(() => {
    return 'mock-toast-id';
  });

  try {
  (axiosInstance.get as any).mockRejectedValueOnce(new Error("Network Error"));

  renderComponent();

  await waitFor(() => {
    expect(toast.error).toHaveBeenCalledWith(
      "Error in getting the HealthCareSettings",
      expect.any(Object)
    );
  });

  } finally {
    console.error = originalConsoleError;
  }
});

it("renders table with no rows when API returns empty array", async () => {
  (axiosInstance.get as any).mockResolvedValueOnce({
    status: 200,
    data: [],
  });

  renderComponent();

  await waitFor(() => {
    expect(screen.queryByText("FHIR Server Url")).toBeInTheDocument();

    expect(
      screen.queryByRole("row", { name: /abc123/i })
    ).not.toBeInTheDocument();
  });
});

it("calls addNewHealthCare and navigates on Add New button click", async () => {
  (axiosInstance.get as any).mockResolvedValueOnce({ status: 200, data: [] });

  renderComponent();

  const button = await screen.findByText("Add New HealthCare Settings");
  fireEvent.click(button);

  await waitFor(() => {
    expect((globalThis as any).mockAddNewHealthCare).toHaveBeenCalledWith({
      addNewHealthCare: true,
    });
    expect((globalThis as any).mockNavigate).toHaveBeenCalledWith(
      "/healthCareSettings"
    );
  });
});

it("shows error toast if response status is not 200", async () => {
  (axiosInstance.get as any).mockResolvedValueOnce({
    status: 500,
    data: [],
  });

  renderComponent();

  await waitFor(() => {
    expect(toast.error).toHaveBeenCalledWith(
      "Error in getting the HealthCareSettings",
      expect.any(Object)
    );
  });
});

it("calls editHealthCareSettings when edit button is clicked", async () => {
  const mockData = [
    {
      id: "1",
      clientId: "C1",
      fhirServerBaseURL: "http://fhir.example.com",
      authType: "OAuth",
    },
  ];

  (axiosInstance.get as any).mockResolvedValueOnce({
    status: 200,
    data: mockData,
  });

  renderComponent();

  const editButton = await screen.findByRole("button", { name: "" }); // icon button has no text
  fireEvent.click(editButton);

  await waitFor(() => {
    expect((globalThis as any).mockAddNewHealthCare).toHaveBeenCalledWith({
      addNewHealthCare: false,
    });
    expect(
      (globalThis as any).mockSelectedHealthCareSettings
    ).toHaveBeenCalledWith(mockData[0]);
    expect((globalThis as any).mockNavigate).toHaveBeenCalledWith(
      "/healthCareSettings"
    );
  });
});
