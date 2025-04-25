// AboutUs.jsx
import "./AboutUs.css";

const AboutUs = ({ name, github, picture }) => {
  return (
    <article className="team-card">
      <p data-testid="common-name">{name}</p>
      <p data-testid="scientific-name">
        {github.replace("https://github.com/", "@")}
      </p>
      <a href={github} target="_blank" rel="noopener noreferrer">
        <img data-testid="image-url" src={picture} alt={`${name}'s profile`} />
      </a>
    </article>
  );
};

export default AboutUs;
