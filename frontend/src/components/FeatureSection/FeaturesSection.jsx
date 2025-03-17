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
    <div className={`feature-card ${isActive ? "active" : ""}`}>
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <p>{description}</p>
      <button>Read More</button>
    </div>
  );
};

const FeaturesSection = () => {
  return (
    <section className="features-section">
      <h2>
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