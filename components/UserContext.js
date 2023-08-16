import React, { createContext, useState } from "react";

export const UserContext = createContext({
  userData: {
    isGuest: true,
    age: null,
    gender: null,
    allergies: null,
    healthConcerns: null,
  },
  setUserData: () => {},
});

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    isGuest: true,
    age: null,
    gender: null,
    allergies: null,
    healthConcerns: null,
  });

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};
