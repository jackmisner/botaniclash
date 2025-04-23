import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BotaniclashLogo from "/BotaniClashLogo.svg";
import soundOff from "../../assets/soundOff.png"
import soundOn from "../../assets/soundOn.png"
import clickSound from "../../assets/soundFX/mouse-click.mp3"
import "./Header.css";

const Header = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [sound, setSound] = useState(() => {
    const saved = localStorage.getItem("sound");
    localStorage.setItem("sound", true)
    return saved === null ? true : saved === "true";
  });

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

  const toggleSound = () => {
    const newSound = !sound;
    setSound(newSound);
    localStorage.setItem("sound", newSound);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event("authChange"));
    if (localStorage.getItem("sound") === "true") {
      const click = new Audio(clickSound);
      click.volume = 0.3;
      click.play();
    }
  };

  const playClickSound = () => {
    if (localStorage.getItem("sound") === "true") {
      const click = new Audio(clickSound);
      click.volume = 0.3;
      click.play();
    }
  }

  return (
    <>
      <header className="header">
        <Link to="/" className="logo">
          <img src={BotaniclashLogo} alt="BotaniClash Logo" />
        </Link>
        <nav className="nav">
        <div className="sound-toggle" onClick={toggleSound}>
          <img src={sound ? soundOn : soundOff}></img>
        </div>
          {!token && (
            <Link to="/signup" className="nav-link" onClick={playClickSound}>
              Signup
            </Link>
          )}
          {!token && (
            <Link to="/login" className="nav-link" onClick={playClickSound}>
              Login
            </Link>
          )}

          {token && (
            <Link to="/" onClick={handleLogout} className="nav-link">
              Logout
            </Link>
          )}
        </nav>
      </header>
      <div className="content"></div>
    </>
  );
};

export default Header;
