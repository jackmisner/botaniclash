import { useState } from "react";
import { Link } from "react-router-dom";
import BotaniclashLogo from "../../assets/BotaniClashLogo.png";

const Header = () => {
  const token = localStorage.getItem("token");
  const loggedIn = token !== null;

  const [isLoggedIn, setIsLoggedIn] = useState(loggedIn);

  const handleClick = () => {
    return setIsLoggedIn(false);
  };
  return (
    <>
      <header className="header">
        <Link to="/" className="logo">
          <img src={BotaniclashLogo} />
        </Link>
        <nav className="nav">
          {!isLoggedIn && (
            <Link to="/signup" className="nav-link">
              Signup
            </Link>
          )}
          {!isLoggedIn && (
            <Link to="/login" className="nav-link">
              Login
            </Link>
          )}

          {isLoggedIn && (
            <Link to="/" onClick={handleClick} className="nav-link">
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
