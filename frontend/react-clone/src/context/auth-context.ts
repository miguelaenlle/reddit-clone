import { createContext } from "react";

interface AuthContextInterface {
  isLoggedIn: boolean;
  userId: string | null;
  token: string | null;
  login: (uid: string, token: string, expirationDate: Date | null) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextInterface | null>(null);
