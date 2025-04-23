import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../LoginSignupPage.css";
import { login } from "../../services/authentication";
import clickSound from "../../assets/soundFX/mouse-click.mp3"

export const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = await login(username, password);
      localStorage.setItem("token", token);
      // Dispatch custom event to notify Header component
      window.dispatchEvent(new Event("authChange"));
      navigate("/");
    } catch (err) {
      console.error(err);
      navigate("/login");
    }
    if (localStorage.getItem("sound") === "true") {
      const click = new Audio(clickSound);
      click.volume = 0.3;
      click.play();
    }
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={handleUsernameChange}
        />
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />
        <input role="submit-button" id="submit" type="submit" value="Submit" />
      </form>
    </div>
  );
};
