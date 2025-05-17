import React from 'react'
import HeroSection from './HeroSection'
import CategoryCarousel from './CategoryCarousel'
import LatestJobs from './LatestJobs'
import OfferSection from './OfferSection'



function Homecontent() {

  return (
    <div>
      <HeroSection />
      <CategoryCarousel />
      <LatestJobs />
      <OfferSection/>
    </div>
  )
}

export default Homecontent
