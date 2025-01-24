import React, { createContext, useContext, useState, useEffect } from "react";
import { ACCESS_TOKEN } from "../constants";
import { jwtDecode } from "jwt-decode"; // Changed import syntax

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(
    Boolean(localStorage.getItem(ACCESS_TOKEN))
  );
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );
  const [firstName, setFirstName] = useState(
    localStorage.getItem("first_name") || ""
  );
  const [lastName, setLastName] = useState(
    localStorage.getItem("last_name") || ""
  );
  const [isStaff, setIsStaff] = useState(false);
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [authState, setAuthState] = useState({}); // Add this line

  const refreshUserData = () => {
    setUsername(localStorage.getItem("username") || "");
    setFirstName(localStorage.getItem("first_name") || "");
    setLastName(localStorage.getItem("last_name") || "");
    setIsStaff(localStorage.getItem("is_staff") === "true");
    setIsSuperuser(localStorage.getItem("is_superuser") === "true");
  };

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          logout();
        } else {
          setIsStaff(decodedToken.is_staff === true);
          setIsSuperuser(decodedToken.is_superuser === true);
          refreshUserData(); // Add this line to load user data
        }
      } catch (error) {
        logout();
      }
    } else {
      logout();
    }
  }, []);

  const login = (
    user,
    firstName,
    lastName,
    staff = false,
    superuser = false
  ) => {
    setUsername(user);
    setFirstName(firstName);
    setLastName(lastName);
    setIsStaff(staff);
    setIsSuperuser(superuser);
    setIsAuthorized(true);

    localStorage.setItem("username", user);
    localStorage.setItem("first_name", firstName);
    localStorage.setItem("last_name", lastName);
    localStorage.setItem("is_staff", staff);
    localStorage.setItem("is_superuser", superuser);
    setAuthState({}); // Trigger re-render
  };

  const logout = () => {
    localStorage.clear();
    setIsAuthorized(false);
    setUsername("");
    setFirstName("");
    setLastName("");
    setIsStaff(false);
    setIsSuperuser(false);
    setAuthState({}); // Trigger re-render
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthorized,
        username,
        firstName,
        lastName,
        isStaff,
        isSuperuser,
        login,
        logout,
        authState, // Provide authState
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
