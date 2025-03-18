import React from "react";
import "./HeroSection.css";
import vegetablesImg from "../../assets/vegetables.png";
import eggImg from "../../assets/egg.png";
import breadImg from "../../assets/bread.png";
import milkImg from "../../assets/milk.png";
import TrueFocus from "../TrueFocus/TrueFocus";

const HeroSection = () => {
  return (
    <div className="header">
      <img className="vegetable-img" src={vegetablesImg} alt="" />
      <img className="egg-img" src={eggImg} alt="" />
      <img className="bread-img" src={breadImg} alt="" />
      <img className="milk-img" src={milkImg} alt="" />
      <video className="background-video" autoPlay loop muted>
    <source src="/src/assets/hero-video.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>
      <div className="header-contents">
        <TrueFocus
          sentence="Urban Foods"
          manualMode={false}
          blurAmount={5}
          borderColor="green"
          animationDuration={2}
          pauseBetweenAnimations={1}
        />
        <p>
          Connect directly with local farmers and artisans. Experience the
          freshest produce, dairy, and handcrafted goods delivered straight to
          your doorstep.
        </p>

        <a href="#explore-menu">
          <button>View Menu</button>
        </a>
      </div>
    </div>
  );
};

export default HeroSection;
