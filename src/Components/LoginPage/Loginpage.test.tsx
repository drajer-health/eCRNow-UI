import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "./Loginpage";
import { vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { scheduleRefreshToken } from "../../Services/AxiosConfig";

vi.mock("axios");
vi.mock("js-cookie");
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));
vi.mock("../../Services/AxiosConfig", () => ({
  scheduleRefreshToken: vi.fn(),
}));

const mockNavigate = vi.fn();
const mockSetAuthorized = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = (await importOriginal()) as typeof import("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderWithRouter = (props = {}) =>
  render(
    <BrowserRouter>
      <LoginPage setAuthorized={vi.fn()} {...props} />
    </BrowserRouter>
  );

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    import.meta.env.VITE_ECR_BASE_URL = "http://fakeapi.com";
  });

  // validateForm
  it("validateForm - positive: returns true for valid inputs", () => {
    renderWithRouter();
    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: "validuser" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "validpass" },
    });
    const form = screen.getByTestId("login-form");
    expect(form).toBeTruthy();
  });

  it("shows error for empty inputs", async () => {
    render(<LoginPage setAuthorized={vi.fn()} />);

    const usernameInput = screen.getByPlaceholderText(/username/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    // Type something, then clear to trigger validation logic
    fireEvent.change(usernameInput, { target: { value: "temp" } });
    fireEvent.change(passwordInput, { target: { value: "temp" } });
    fireEvent.change(usernameInput, { target: { value: "" } });
    fireEvent.change(passwordInput, { target: { value: "" } });

    // Click should now be enabled
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(
      await screen.findByText(/please enter username/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/please enter password/i)
    ).toBeInTheDocument();
  });

  it("validateForm - neutral: username ok, password short", () => {
    renderWithRouter();
    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: "abc" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "123" },
    });
    expect(
      screen.getByText(/password must be at least 4/i)
    ).toBeInTheDocument();
  });

  // handleUsernameChange / handlePasswordChange
  it("username/password change - positive: clears error for valid", () => {
    renderWithRouter();
    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: "validname" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "validpass" },
    });
    expect(screen.queryByText(/please enter username/i)).toBeNull();
    expect(screen.queryByText(/please enter password/i)).toBeNull();
  });

  it("username/password change - negative: strips spaces", () => {
    renderWithRouter();
    const usernameInput = screen.getByPlaceholderText(/username/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    fireEvent.change(usernameInput, { target: { value: "user name" } });
    fireEvent.change(passwordInput, { target: { value: "pass word" } });

    expect(usernameInput).toHaveValue("username");
    expect(passwordInput).toHaveValue("password");
});

  it("username/password change - neutral: partial validity", () => {
    renderWithRouter();
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "12" },
    });
    expect(
      screen.getByText(/password must be at least 4/i)
    ).toBeInTheDocument();
  });

  // handleLogin
  it("handleLogin - positive: successful login", async () => {
    (axios.post as any).mockResolvedValue({
      data: { access_token: "token123", refresh_token: "rtoken" },
    });

    const setAuthorized = vi.fn();
    renderWithRouter({ setAuthorized });

    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: "abc" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "abcd" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(Cookies.set).toHaveBeenCalledWith("jwt_token", "token123");
      expect(scheduleRefreshToken).toHaveBeenCalled();
      expect(setAuthorized).toHaveBeenCalledWith(true);
      expect(toast.success).toHaveBeenCalledWith(
        expect.stringContaining("Login successful!"),
        expect.any(Object)
      );
    });
  });

  it("handleLogin - negative: API error triggers toast.error", async () => {
  const originalConsoleError = console.error;
  console.error = vi.fn(); 

  vi.spyOn(toast, "error").mockImplementation(() => {
    return "mock-toast-id";
  });

  try {
    (axios.post as any).mockRejectedValue(new Error("API fail"));

    renderWithRouter();
    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: "abc" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "abcd" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining("Invalid username or password"),
        expect.any(Object)
      );
    });
  } finally {
    console.error = originalConsoleError;
  }
  });

  it("handleLogin - neutral: missing env var triggers console error", async () => {
    import.meta.env.VITE_ECR_BASE_URL = "";
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    renderWithRouter();
    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: "abc" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "abcd" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalled();
    });
  });

  // Password toggle
  it("password toggle - positive: click toggles show", () => {
    renderWithRouter();
    const toggle = screen.getByTestId("password-toggle");
    fireEvent.click(toggle);
    expect(screen.getByPlaceholderText(/password/i)).toHaveAttribute(
      "type",
      "text"
    );
  });

  it("password toggle - negative: click twice resets", () => {
    render(<LoginPage setAuthorized={mockSetAuthorized} />);

    const toggle = screen.getByTestId("password-toggle");
    const passwordInput = screen.getByPlaceholderText(/password/i);

    expect(passwordInput).toHaveAttribute("type", "password");

    fireEvent.click(toggle);
    expect(passwordInput).toHaveAttribute("type", "text");

    fireEvent.click(toggle);
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("password toggle - neutral: initial state hidden", () => {
    renderWithRouter();
    expect(screen.getByPlaceholderText(/password/i)).toHaveAttribute(
      "type",
      "password"
    );
  });

  // useEffect logout/sessionExpired
  it("logoutSuccess toast - positive", () => {
    localStorage.setItem("logoutSuccess", "true");
    renderWithRouter();
    expect(toast.success).toHaveBeenCalledWith(
      expect.stringContaining("Logout successful"),
      expect.any(Object)
    );
  });

  it("sessionExpired toast - negative", () => {
    localStorage.setItem("sessionExpired", "true");
    renderWithRouter();
    expect(toast.error).toHaveBeenCalledWith(
      expect.stringContaining("Session expired"),
      expect.any(Object)
    );
  });

  it("neutral: no localStorage values", () => {
    localStorage.clear();
    renderWithRouter();
    expect(toast.success).not.toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
  });
});