import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./HomePage.css";
import clickSound from "../../assets/soundFX/mouse-click.mp3"

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

  const playClickSound = () => {
    if (localStorage.getItem("sound") === "true") {
      const click = new Audio(clickSound);
      click.volume = 0.3;
      click.play();
    }
  }

  return (
    <div className="home">
      <h1>Welcome to BotaniClash!</h1>
      <div className="homepage-nav">
        {token && (
          <Link to="/setupgame" className="homepage-nav-link" onClick={playClickSound}>
            Play game
          </Link>
        )}

        <Link to="/leaderboard" className="homepage-nav-link" onClick={playClickSound}>
          Leaderboard
        </Link>
      </div>
    </div>
  );
};
