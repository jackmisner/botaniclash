import "./HomePage.css";
import AboutUsContainer from "../../components/AboutUsContainer";
export const HomePage = () => {
  return (
    <div className="home">
      <h1>Welcome to BotaniClash!</h1>
      <h2>A competetive plant-based card game!</h2>
      <AboutUsContainer />
    </div>
  );
};
