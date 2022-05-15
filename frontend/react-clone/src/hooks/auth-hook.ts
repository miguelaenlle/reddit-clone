import { useCallback, useEffect, useState } from "react";

let logoutTimer: any;

export const useAuth = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [tokenExpirationDate, setTokenExpirationDate] = useState<Date | null>(
    null
  );
  const [token, setToken] = useState<string | null>(null);

  const login = useCallback(
    (
      username: string,
      uid: string,
      token: string,
      expirationDate: Date | null
    ) => {
      setIsLoggedIn(true);
      setUserId(uid);
      console.log("user id", uid);
      setToken(token);
      setUsername(username);
      const tokenExpirationDate =
        expirationDate ||
        new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000); // 1 week
      setTokenExpirationDate(tokenExpirationDate);

      localStorage.setItem(
        "userData",
        JSON.stringify({
          username,
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
    setUsername(null);
    localStorage.removeItem("userData");
  }, []);

  const autoLogin = useCallback(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      console.log(parsedUserData);
      const expirationDate = new Date(parsedUserData.expiration);
      if (expirationDate > new Date()) {
        login(
          parsedUserData.username,
          parsedUserData.userId,
          parsedUserData.token,
          expirationDate
        );
      }
    }
  }, []);

  useEffect(() => {
    autoLogin();
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  return {
    username,
    token,
    isLoggedIn,
    userId,
    login,
    logout,
  };
};
