export interface AuthState {
  user: {
    id: string;
    email: string;
  } | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
