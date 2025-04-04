import React from 'react'
import Hero from '../../components/HeroSection/Hero'
import FeaturesSection from '../../components/FeatureSection/FeaturesSection'
import OfferSection from '../../components/OfferSection/OfferSection'
import ProductSection from '../../components/ProductSection/ProductSection'
import CusromerReview from '../../components/CustomerFeedback/CustomerFeedbackshow.jsx'
import Footer from '../../components/FooterSection/Footer.jsx'
import Profile from '../../components/ProfileUi/Profile.jsx'
import Dashboard from '../Dashboard/Dashboard.jsx'

function Homepage() {
  return (
    <>
      <Hero/>
      <FeaturesSection/>
      <ProductSection/>
      <OfferSection/>
      <CusromerReview/>
      <Footer />

    </>
  )
}

export default Homepage