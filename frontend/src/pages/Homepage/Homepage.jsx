import React from 'react'
import HeroSection from '../../components/HeroSection/HeroSection'
import Hero from '../../components/HeroSection/Hero'
import FeaturesSection from '../../components/FeatureSection/FeaturesSection'
import OfferSection from '../../components/OfferSection/OfferSection'
import ProductSection from '../../components/ProductSection/ProductSection'

function Homepage() {
  return (
    <>
      <Hero/>
      <FeaturesSection/>
      <ProductSection/>
      <OfferSection/>
    </>
  )
}

export default Homepage