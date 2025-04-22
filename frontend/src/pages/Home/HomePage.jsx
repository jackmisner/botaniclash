import { Link } from "react-router-dom";
import "./HomePage.css";

export const HomePage = () => {
  return (
    <div className="home">
      <h1>Welcome to BotaniClash!</h1>

      <Link to="/setupgame">Play game</Link>
    </div>
  );
};
