import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { toast } from "react-toastify";
import { MemoryRouter } from "react-router-dom";
import axiosInstance from "../../Services/AxiosConfig";
import PublicHealthAuthority from "./PublicHealthAuthority";

const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => navigateMock,
    };
});

vi.mock("react-toastify", () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
        warning: vi.fn(),
    },
}));

vi.mock("../../withRouter", () => ({
    withRouter: (component: React.FC) => component,
}));

vi.mock("../../Services/AxiosConfig", () => ({
    default: vi.fn(),
}));

const mockedAxios = vi.mocked(axiosInstance);

describe("PublicHealthAuthority", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    function renderComponent(props = {}) {
        return render(
            <MemoryRouter>
                <PublicHealthAuthority {...props} />
            </MemoryRouter>
        );
    }

    it("submits form with valid data and shows success toast", async () => {
        mockedAxios.mockResolvedValue({ status: 200, data: {} });

        renderComponent({ addNewHealthAuthority: true });

        await userEvent.type(screen.getByLabelText(/Client Id:/i), "client-id");
        await userEvent.type(screen.getByLabelText(/Scopes:/i), "launch openid");
        await userEvent.type(screen.getByLabelText(/FHIR Server Base URL:/i), "http://example.com/fhir");
        await userEvent.type(screen.getByLabelText(/Token Endpoint:/i), "http://example.com/token");

        await userEvent.click(screen.getByRole("button", { name: /save/i }));

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith(
                "Client Details are saved successfully.",
                expect.any(Object)
            );
        });
    });

    it("shows warning toast when required fields are missing", async () => {
        renderComponent({ addNewHealthAuthority: true });

        await userEvent.click(screen.getByRole("button", { name: /save/i }));

        await waitFor(() => {
            expect(toast.warning).toHaveBeenCalledWith(
                "Please enter all the required fields.",
                expect.any(Object)
            );
        });
    });

    it("handles error from save API", async () => {
    const originalConsoleError = console.error;
    console.error = vi.fn();
    try {
        mockedAxios.mockRejectedValue(new Error("Network Error"));

        renderComponent({ addNewHealthAuthority: true });

        await userEvent.type(screen.getByLabelText(/Client Id:/i), "client-id");
        await userEvent.type(screen.getByLabelText(/Scopes:/i), "launch openid");
        await userEvent.type(screen.getByLabelText(/FHIR Server Base URL:/i), "http://example.com/fhir");
        await userEvent.type(screen.getByLabelText(/Token Endpoint:/i), "http://example.com/token");

        await userEvent.click(screen.getByRole("button", { name: /save/i }));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(
                "Error in Saving the HealthAuthority Settings",
                expect.any(Object)
            );
        });
    } finally {
        console.error = originalConsoleError;
    }
    });

    it("renders Client Secret when authType is not SofProvider", async () => {
        renderComponent({ addNewHealthAuthority: true });

        const radio = screen.getByLabelText(/System Launch/i);
        await userEvent.click(radio);

        await waitFor(() => {
            expect(screen.getByLabelText(/Client Secret:/i)).toBeInTheDocument();
        });
    });

    it("renders Username and Password when authType is UserNamePwd", async () => {
        renderComponent({ addNewHealthAuthority: true });

        await userEvent.click(screen.getByLabelText(/Username and Password/i));

        await waitFor(() => {
            expect(screen.getByLabelText(/Username:/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/Password:/i)).toBeInTheDocument();
        });
    });

    it("displays alert and allows dismissal", async () => {
        mockedAxios.mockResolvedValue({ status: 200, data: {} });

        renderComponent({ addNewHealthAuthority: true });

        await userEvent.type(screen.getByLabelText(/Client Id:/i), "client-id");
        await userEvent.type(screen.getByLabelText(/Scopes:/i), "launch openid");
        await userEvent.type(screen.getByLabelText(/FHIR Server Base URL:/i), "http://example.com/fhir");
        await userEvent.type(screen.getByLabelText(/Token Endpoint:/i), "http://example.com/token");

        await userEvent.click(screen.getByRole("button", { name: /save/i }));

        const alertText = await screen.findByText(/Public Health Authority are saved successfully/i);
        expect(alertText).toBeInTheDocument();

        const alertDiv = screen.getByRole("alert");
        const closeBtn = alertDiv.querySelector("button");
 
        expect(closeBtn).toBeInTheDocument();
        if (closeBtn) {
            await userEvent.click(closeBtn);
        }

        await waitFor(() => {
            expect(screen.queryByText(/Public Health Authority are saved successfully/i)).not.toBeInTheDocument();
        });
    });

    it("calls PUT API when editing existing authority", async () => {
        mockedAxios.mockResolvedValue({ status: 200, data: {} });

        const selectedPHA = {
            id: 101,
            authType: "SofSystem",
            clientId: "existing-client",
            clientSecret: "secret",
            username: "",
            password: "",
            fhirServerBaseURL: "http://example.com/fhir",
            tokenUrl: "http://example.com/token",
            scopes: "launch openid",
            restApiUrl: "",
        };

        renderComponent({
            addNewHealthAuthority: false,
            selectedPublicHealthAuthority: selectedPHA,
        });

        expect(screen.getByDisplayValue("existing-client")).toBeInTheDocument();

        await userEvent.click(screen.getByRole("button", { name: /save/i }));

        await waitFor(() => {
            expect(mockedAxios).toHaveBeenCalledWith(
                expect.objectContaining({ method: "PUT" })
            );
        });
    });

    it("navigates to existing PublicHealthAuthority list on button click", async () => {
        renderComponent();

        await userEvent.click(screen.getByRole("button", { name: /Existing PublicHealthAuthority/i }));

        expect(navigateMock).toHaveBeenCalledWith("/publicHealthAuthorityList");
    });
});
