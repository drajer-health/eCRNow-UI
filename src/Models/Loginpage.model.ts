export interface LoginPageProps {
  setAuthorized: (authorized: boolean) => void;
}

export interface AuthResponse {
  access_token: string;
  refresh_token?: string;
}

export interface ValidationErrors {
  username: string;
  password: string;
}