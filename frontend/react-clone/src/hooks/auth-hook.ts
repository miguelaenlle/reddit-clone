import { useCallback, useEffect, useState } from "react";

let logoutTimer: any;

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [tokenExpirationDate, setTokenExpirationDate] = useState<Date | null>(
    null
  );
  const [token, setToken] = useState<string | null>(null);

  const login = useCallback(
    (uid: string, token: string, expirationDate: Date | null) => {
      setIsLoggedIn(true);
      setUserId(uid);
      setToken(token);
      const tokenExpirationDate =
        expirationDate ||
        new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000); // 1 week
      console.log(uid, token, expirationDate);
      setTokenExpirationDate(tokenExpirationDate);

      localStorage.setItem(
        "userData",
        JSON.stringify({
          userId: uid,
          token,
          expiration: tokenExpirationDate.toISOString(),
        })
      );
    },
    []
  );

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUserId(null);
    setToken(null);
    setTokenExpirationDate(null);
    localStorage.removeItem("userData");
  }, []);

  const autoLogin = useCallback(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      const expirationDate = new Date(parsedUserData.expiration);
      console.log(expirationDate, new Date());
      if (expirationDate > new Date()) {
        login(parsedUserData.userId, parsedUserData.token, expirationDate);
      }
    }
  }, []);

  useEffect(() => {
    autoLogin();
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      console.log("Expiration date", tokenExpirationDate);
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  return {
    token,
    isLoggedIn,
    userId,
    login,
    logout,
  };
};
