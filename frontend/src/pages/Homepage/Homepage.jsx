import React from 'react'
import HeroSection from '../../components/HeroSection/HeroSection'
import Hero from '../../components/HeroSection/Hero'
import FeaturesSection from '../../components/FeatureSection/FeaturesSection'
import OfferSection from '../../components/OfferSection/OfferSection'
import ProductSection from '../../components/ProductSection/ProductSection'
import CusromerReview from '../../components/CustomerReviewsSection/CustomerReviews.jsx'
import Footer from '../../components/FooterSection/Footer.jsx'
import Profile from '../../components/ProfileUi/Profile.jsx'

function Homepage() {
  return (
    <>
      <Profile/>
      <Hero/>
      <FeaturesSection/>
      <ProductSection/>
      <CusromerReview/>
      <Footer />

    </>
  )
}

export default Homepage