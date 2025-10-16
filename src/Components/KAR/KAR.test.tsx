import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import KAR from "./KAR";
import { BrowserRouter } from "react-router-dom";
import axiosInstance from "../../Services/AxiosConfig";
import { toast } from "react-toastify";

// Mock modules
vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

vi.mock("../../Services/AxiosConfig");

const mockGet = axiosInstance.get as unknown as ReturnType<typeof vi.fn>;
const mockPost = axiosInstance.post as unknown as ReturnType<typeof vi.fn>;

const renderComponent = () => {
  return render(
    <BrowserRouter>
      <KAR />
    </BrowserRouter>
  );
};

describe("handleChange", () => {
  it("updates repoName correctly", () => {
    renderComponent();
    const input = screen.getByPlaceholderText("Enter Repository Name");
    fireEvent.change(input, {
      target: { value: "TestRepo", name: "repoName" },
    });
    expect((input as HTMLInputElement).value).toBe("TestRepo");
  });

  it("doesnt update when name is incorrect", () => {
    renderComponent();
    const input = screen.getByPlaceholderText("Enter Repository Name");
    fireEvent.change(input, {
      target: { value: "Wrong", name: "invalidField" },
    });
    expect((input as HTMLInputElement).value).toBe("");
  });

  it("handles empty input value gracefully", () => {
    renderComponent();
    const input = screen.getByPlaceholderText("Enter Repository Name");
    fireEvent.change(input, { target: { value: "", name: "repoName" } });
    expect((input as HTMLInputElement).value).toBe("");
  });
});

describe("getKARs", () => {
  beforeEach(() => {
    mockGet.mockReset();
  });

  it("fetches and renders KARs successfully", async () => {
    mockGet.mockResolvedValue({
      status: 200,
      data: {
        entry: [
          {
            resource: {
              id: "1",
              name: "KAR1",
              publisher: "Publisher1",
              version: "1.0",
            },
          },
        ],
      },
    });

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText("Enter Repository Name"), {
      target: { value: "Repo1", name: "repoName" },
    });
    fireEvent.change(screen.getByPlaceholderText("FHIR Server URL"), {
      target: { value: "http://fhir.com", name: "fhirServerURL" },
    });

    fireEvent.click(screen.getByText("Search KAR"));

    await waitFor(() => {
      expect(screen.getByText("KAR1")).toBeInTheDocument();
    });
  });

  it("shows error toast on failed fetch", async () => {
    mockGet.mockRejectedValue(new Error("Fetch error"));

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText("Enter Repository Name"), {
      target: { value: "Repo1", name: "repoName" },
    });
    fireEvent.change(screen.getByPlaceholderText("FHIR Server URL"), {
      target: { value: "http://fhir.com", name: "fhirServerURL" },
    });

    fireEvent.click(screen.getByText("Search KAR"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Error in fetching the PlanDefinitions",
        expect.anything()
      );
    });
  });

  it("handles empty entry array", async () => {
    mockGet.mockResolvedValue({ status: 200, data: { entry: [] } });

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText("Enter Repository Name"), {
      target: { value: "Repo1", name: "repoName" },
    });
    fireEvent.change(screen.getByPlaceholderText("FHIR Server URL"), {
      target: { value: "http://fhir.com", name: "fhirServerURL" },
    });

    fireEvent.click(screen.getByText("Search KAR"));

    await waitFor(() => {
      expect(screen.queryByText("PlanDefinitionId")).toBeInTheDocument();
    });
  });
});

describe("saveKAR", () => {
  beforeEach(() => {
    mockPost.mockReset();
    mockGet.mockResolvedValue({
      status: 200,
      data: {
        entry: [
          {
            resource: {
              id: "1",
              name: "KAR1",
              publisher: "Publisher1",
              version: "1.0",
            },
          },
        ],
      },
    });
  });

  it("saves KAR successfully", async () => {
    mockPost.mockResolvedValue({ status: 200 });

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText("Enter Repository Name"), {
      target: { value: "Repo1", name: "repoName" },
    });
    fireEvent.change(screen.getByPlaceholderText("FHIR Server URL"), {
      target: { value: "http://fhir.com", name: "fhirServerURL" },
    });

    fireEvent.click(screen.getByText("Search KAR"));
    await screen.findByText("KAR1");

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "KAR Details are saved successfully.",
        expect.anything()
      );
    });
  });

  it("handles error during save", async () => {
    mockPost.mockRejectedValue(new Error("Save failed"));

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText("Enter Repository Name"), {
      target: { value: "Repo1", name: "repoName" },
    });
    fireEvent.change(screen.getByPlaceholderText("FHIR Server URL"), {
      target: { value: "http://fhir.com", name: "fhirServerURL" },
    });

    fireEvent.click(screen.getByText("Search KAR"));
    await screen.findByText("KAR1");

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Error in Saving the Knowledge Artifact Repositories",
        expect.anything()
      );
    });
  });

  it("doesnt call save if form is invalid", async () => {
    renderComponent();
    fireEvent.submit(screen.getByTestId("kar-form"));
    await waitFor(() => {
      expect(mockPost).not.toHaveBeenCalled();
    });
  });
});
