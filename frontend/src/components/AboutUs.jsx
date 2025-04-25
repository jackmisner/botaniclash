// AboutUs.jsx
import "./AboutUs.css";

const AboutUs = ({ name, github, picture }) => {
  return (
    <article className="team-card">
      <p data-testid="common-name">{name}</p>
      <p data-testid="scientific-name">
        <a href={github} target="_blank" rel="noopener noreferrer">
          {github.replace("https://github.com/", "@")}
        </a>
      </p>
      <img
        data-testid="image-url"
        src={picture}
        alt={`${name}'s profile`}
        onError={(e) => {
          e.target.src = "/path/to/fallback-image.png";
          e.target.onerror = null;
        }}
      />
    </article>
  );
};

export default AboutUs;
