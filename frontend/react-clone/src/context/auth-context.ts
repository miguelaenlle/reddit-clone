import { createContext } from "react";

interface AuthContextInterface {
  username: string | null;
  isLoggedIn: boolean;
  userId: string | null;
  token: string | null;
  login: (username: string, uid: string, token: string, expirationDate: Date | null) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextInterface | null>(null);
