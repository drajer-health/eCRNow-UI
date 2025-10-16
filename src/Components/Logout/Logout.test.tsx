import { render } from "@testing-library/react";
import Cookies from "js-cookie";
import Logout from "./Logout";
import type { Mock } from "vitest";

// Mock dependencies
vi.mock("js-cookie", () => ({
  default: {
    remove: vi.fn(),
  },
}));

describe("Logout Component", () => {
  let locationReplaceMock: Mock;
  const originalLocation = window.location;

  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(Storage.prototype, "setItem");
    vi.spyOn(Storage.prototype, "getItem");

    // @ts-expect-error - override for testing
    delete window.location;
    window.location = {
      ...originalLocation,
      replace: vi.fn(),
    } as unknown as Location & string;

    locationReplaceMock = window.location.replace as unknown as Mock;
  });

  afterAll(() => {
    window.location = originalLocation as unknown as Location & string; //restore with correct type
  });

  it("should remove tokens, set logout flag, and redirect to /login", () => {
    render(<Logout />);

    expect(Cookies.remove).toHaveBeenCalledWith("jwt_token");
    expect(Cookies.remove).toHaveBeenCalledWith("refresh_token");
    expect(localStorage.setItem).toHaveBeenCalledWith("logoutSuccess", "true");
    expect(locationReplaceMock).toHaveBeenCalledWith("/login");
  });

  it("should still attempt logout even if cookie removal logs an error", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    (Cookies.remove as Mock).mockImplementationOnce(() => {
      console.error("Cookie removal failed");
    });

    render(<Logout />);

    expect(consoleSpy).toHaveBeenCalledWith("Cookie removal failed");
    expect(Cookies.remove).toHaveBeenCalledWith("refresh_token");
    expect(localStorage.setItem).toHaveBeenCalledWith("logoutSuccess", "true");
    expect(locationReplaceMock).toHaveBeenCalledWith("/login");

    consoleSpy.mockRestore();
  });

  it("should not do anything on re-render since useEffect runs only once", () => {
    const { rerender } = render(<Logout />);
    rerender(<Logout />);

    expect(Cookies.remove).toHaveBeenCalledTimes(2);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(locationReplaceMock).toHaveBeenCalledTimes(1);
  });
});
