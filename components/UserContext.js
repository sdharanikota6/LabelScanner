import React, { createContext, useState } from "react";

// Create a context for managing user data, providing initial values and setter function.
export const UserContext = createContext({
  userData: {
    isGuest: true,
    age: null,
    gender: null,
    allergies: null,
    healthConcerns: null,
  },
  setUserData: () => {}, // Placeholder setter function
});

// Define a UserProvider component that uses the UserContext to manage and share user data.
export const UserProvider = ({ children }) => {
  // Initialize userData state using the useState hook with default values.
  const [userData, setUserData] = useState({
    isGuest: true,
    age: null,
    gender: null,
    allergies: null,
    healthConcerns: null,
  });

  // Wrap the children components with the UserContext.Provider and provide userData and setUserData.
  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};
