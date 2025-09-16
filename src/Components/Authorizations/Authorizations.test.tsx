import { render, waitFor } from "@testing-library/react";
import Authorizations from "./Authorizations";
import { vi } from "vitest";
import { AuthorizationsProps } from "../../Models/Authorizations.model";

describe("Authorizations Component", () => {
  const mockAuthData: AuthorizationsProps["authData"] = {
    clientId: "testClientId",
    scope: "testScope",
    redirectUri: "http://localhost/redirect",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    global.fetch = vi.fn().mockResolvedValue({
      status: 200,
      json: () =>
        Promise.resolve({
          fhirVersion: "4.0.0",
          rest: [
            {
              security: {
                extension: [
                  {
                    extension: [
                      {
                        url: "register",
                        valueUri: "http://testhost.com/register",
                      },
                      {
                        url: "authorize",
                        valueUri: "http://testhost.com/authorize",
                      },
                    ],
                  },
                ],
              },
            },
          ],
        }),
    }) as any;

    delete (window as any).location;
    (window as any).location = {
      protocol: "http:",
      host: "testhost.com",
      pathname: "/app/page",
      search: "?iss=testISS&launch=testLaunch&code=testCode&state=testState",
      href: "http://testhost.com/app/page?query=123",
      replace: vi.fn(),
    };
  });

  it("positive case - processes register & authorize URLs", async () => {
    render(<Authorizations authData={mockAuthData} />);
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(3);
    });
  });

  it("neutral case - still runs when fhirVersion is different", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      status: 200,
      json: () =>
        Promise.resolve({
          fhirVersion: "3.0.0",
          rest: [
            {
              security: {
                extension: [
                  {
                    extension: [
                      {
                        url: "register",
                        valueUri: "http://testhost.com/register",
                      },
                      {
                        url: "authorize",
                        valueUri: "http://testhost.com/authorize",
                      },
                    ],
                  },
                ],
              },
            },
          ],
        }),
    });

    render(<Authorizations authData={mockAuthData} />);
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  it("negative case - handles missing rest array gracefully", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      status: 200,
      json: () => Promise.resolve({ fhirVersion: "4.0.0" }),
    });

    render(<Authorizations authData={mockAuthData} />);
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });
});
