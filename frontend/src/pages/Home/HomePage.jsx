import { Link } from "react-router-dom";

import "./HomePage.css";

export const HomePage = () => {
  return (
    <div className="home">
      <h1>Welcome to BotaniClash!</h1>
      <Link to="/signup">Sign Up</Link>
      <Link to="/login">Log In</Link>
      <Link to="/setupgame">Setup game</Link>
    </div>
  );
};
