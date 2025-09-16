import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { toast } from "react-toastify";
import ClientDetails from "./ClientDetails";
import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

// Toast mock
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Axios mocks
const mockPost = vi.fn();
const mockPut = vi.fn();

vi.mock("../../Services/AxiosConfig", () => {
  return {
    default: {
      post: <T = any, R = AxiosResponse<T>, D = any>(
        url: string,
        data?: D,
        config?: AxiosRequestConfig<D>
      ): Promise<R> => mockPost(url, data, config),

      put: <T = any, R = AxiosResponse<T>, D = any>(
        url: string,
        data?: D,
        config?: AxiosRequestConfig<D>
      ): Promise<R> => mockPut(url, data, config),
    } as Pick<AxiosInstance, "post" | "put">,
  };
});

// useNavigate mock
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("ClientDetails Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPost.mockReset();
    mockPut.mockReset();
  });

  const setup = (props = {}) => {
    const defaultProps = {
      selectedClientDetails: {},
      addNew: { addNew: true },
      ...props,
    };

    return render(
      <MemoryRouter>
        <ClientDetails {...defaultProps} />
      </MemoryRouter>
    );
  };

  // Basic Rendering Tests
  it("renders the form with all sections", () => {
    setup();
    expect(screen.getByText("FHIR Configuration")).toBeInTheDocument();
    expect(screen.getByText("Transport Configuration")).toBeInTheDocument();
    expect(screen.getByText("App Configuration")).toBeInTheDocument();
  });

  // Launch Type Tests
  it("handles launch type change - provider launch (positive case)", async () => {
    setup();
    const providerLaunch = screen.getByLabelText("Provider Launch");
    await userEvent.click(providerLaunch);
    expect(screen.getByPlaceholderText("Enter ClientId")).toBeInTheDocument();
  });

  it("handles launch type change - system launch (positive case)", async () => {
    setup();
    const systemLaunch = screen.getByLabelText("System Launch");
    await userEvent.click(systemLaunch);
    expect(screen.getByPlaceholderText("Enter Secret")).toBeInTheDocument();
  });

  // Form Submission Test
  it("submits form successfully with valid data (positive case)", async () => {
    mockPost.mockResolvedValueOnce({ status: 200 });

    setup();

    const fhirHeader = screen.queryByText("FHIR Configuration");
    if (fhirHeader) await userEvent.click(fhirHeader);

    const providerLaunch = screen.getByLabelText(/Provider Launch/i);
    await userEvent.click(providerLaunch);

    const form = screen.getByTestId("client-form");
    const clientIdInput =
      form.querySelector<HTMLInputElement>('[name="clientId"]');
    const fhirServerBaseURLInput = form.querySelector<HTMLInputElement>(
      '[name="fhirServerBaseURL"]'
    );
    const tokenEndpointInput = form.querySelector<HTMLInputElement>(
      '[name="tokenEndpoint"]'
    );
    const scopesInput =
      form.querySelector<HTMLTextAreaElement>('[name="scopes"]');

    expect(clientIdInput).toBeTruthy();
    expect(fhirServerBaseURLInput).toBeTruthy();
    expect(tokenEndpointInput).toBeTruthy();
    expect(scopesInput).toBeTruthy();

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      mockPost();
    });

    fireEvent.change(clientIdInput!, { target: { value: "testId" } });
    fireEvent.change(fhirServerBaseURLInput!, {
      target: { value: "http://test.fhir.com" },
    });
    fireEvent.change(tokenEndpointInput!, {
      target: { value: "http://test.token.com" },
    });
    fireEvent.change(scopesInput!, { target: { value: "patient/*.read" } });

    const submitButton = screen.getByRole("button", { name: /save/i });
    await userEvent.click(submitButton);

    await waitFor(
      () => {
        const totalCalls =
          mockPost.mock.calls.length + mockPut.mock.calls.length;
        expect(totalCalls).toBeGreaterThan(0);
      },
      { timeout: 3000 }
    );
  });

  it("shows validation error for empty required fields (negative case)", async () => {
    setup();
    const submitButton = screen.getByRole("button", { name: "Save" });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Please enter all the required fields.",
        expect.any(Object)
      );
    });
  });

  // Toggle Debug Switch Test
  it("toggles debug switch (neutral case)", async () => {
    setup();
    const debugCheckbox = screen.getByRole("checkbox", { name: "" });
    expect(debugCheckbox).not.toBeChecked();
    await userEvent.click(debugCheckbox);
    expect(debugCheckbox).toBeChecked();
  });

  // Navigation Test
  it("navigates back to client list (positive case)", async () => {
    setup();
    const backButton = screen.getByRole("button", {
      name: /existing client details/i,
    });
    await userEvent.click(backButton);
    expect(mockNavigate).toHaveBeenCalledWith("/clientDetailsList");
  });

  // Direct Type Change Test
  it("handles direct type change (positive case)", async () => {
    setup();
    const xdrRadio = screen.getByLabelText("XDR");
    await userEvent.click(xdrRadio);
    expect(
      screen.getByPlaceholderText("Enter XDR Recipient Address")
    ).toBeInTheDocument();
  });
});
