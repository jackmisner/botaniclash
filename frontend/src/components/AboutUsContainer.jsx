// AboutUsContainer.jsx - Optional update if needed
import AboutUs from "./AboutUs";
import "./AboutUs.css";

const AboutUsContainer = () => {
  const us = [
    {
      name: "Abbie Finlayson",
      github: "https://github.com/abbiefinlayson1",
      picture: "https://avatars.githubusercontent.com/u/190519928?v=4",
    },
    {
      name: "Alec McGill",
      github: "https://github.com/AMcGill3",
      picture:
        "https://ca.slack-edge.com/T03ALA7H4-U0892FD1SH2-86ad26fdcf23-512",
    },
    {
      name: "Imogen Lovell",
      github: "https://github.com/I-Lovell",
      picture:
        "https://ca.slack-edge.com/T03ALA7H4-U088ZSY6ZC3-cfaafb34b226-512",
    },
    {
      name: "Jack Misner",
      github: "https://github.com/jackmisner",
      picture: "https://avatars.githubusercontent.com/u/189114969?v=4",
    },
    {
      name: "Luke Howarth",
      github: "https://github.com/LukeHoweth",
      picture: "https://avatars.githubusercontent.com/u/53517302?v=4",
    },
    {
      name: "Michal Podolak",
      github: "https://github.com/Michal-P-1",
      picture:
        "https://ca.slack-edge.com/T03ALA7H4-U08188F7N01-a99979029cde-512",
    },
  ];

  return (
    <div className="about-us-container" data-testid="team-cards-container">
      {us.map(({ name, github, picture }) => (
        <AboutUs key={name} name={name} github={github} picture={picture} />
      ))}
    </div>
  );
};

export default AboutUsContainer;
