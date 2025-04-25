import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./HomePage.css";

export const HomePage = () => {
  const [token, setToken] = useState();

  useEffect(() => {
    // Initial check
    setToken(localStorage.getItem("token"));

    // Create a function to handle storage changes
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };

    // Add event listener
    window.addEventListener("storage", handleStorageChange);

    // Create a custom event listener for login/logout actions
    const handleAuthChange = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener("authChange", handleAuthChange);

    // Cleanup
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  return (
    <div className="home">
      <h1>Welcome to BotaniClash!</h1>
    </div>
  );
};
