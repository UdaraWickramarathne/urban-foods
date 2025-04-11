import React from "react";
import "./FeaturesSection.css";

const features = [
  {
    title: "Fresh And Organic",
    description:
      "Lorem Ipsum Dolor Sit Amet Consectetur Adipisicing Elit. Veniam Dicta Impedit, Facere, Est Fugiat Perspiciatis Porro Provident Possimus Temporibus Laboriosam Nisi Sit, Ea Dolore Quod?",
    image: "src/images/feature-img-1.png",
  },
  {
    title: "Local Product Only",
    description:
      "Lorem Ipsum Dolor Sit Amet Consectetur Adipisicing Elit. Veniam Dicta Impedit, Facere, Est Fugiat Perspiciatis Porro Provident Possimus Temporibus Laboriosam Nisi Sit, Ea Dolore Quod?",
    image: "src/images/feature-img-4.jpg",
  },
  {
    title: "Island Wide Delivery",
    description:
      "Lorem Ipsum Dolor Sit Amet Consectetur Adipisicing Elit. Veniam Dicta Impedit, Facere, Est Fugiat Perspiciatis Porro Provident Possimus Temporibus Laboriosam Nisi Sit, Ea Dolore Quod?",
    image: "src/images/feature-img-2.png",
  },
  {
    title: "Any Payment Method",
    description:
      "Lorem Ipsum Dolor Sit Amet Consectetur Adipisicing Elit. Veniam Dicta Impedit, Facere, Est Fugiat Perspiciatis Porro Provident Possimus Temporibus Laboriosam Nisi Sit, Ea Dolore Quod?",
    image: "src/images/feature-img-3.png",
  },
];

const FeatureCard = ({ title, description, image, isActive }) => {
  return (
    <div className={`feature-card`}>
      <div className="feature-icon">
        <img src={image} alt={title} />
      </div>
      <div className="feature-content">
        <h3>{title}</h3>
        <p>{description}</p>
        <button className="feature-btn">Learn More</button>
      </div>
    </div>
  );
};

const FeaturesSection = () => {
  return (
    <section className="features-section">
      <h2 className="section-title" style={{ fontSize: "24px" }}>
        Our <span>Features</span>
      </h2>
      <div className="features-container">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} isActive={index === 0} />
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;