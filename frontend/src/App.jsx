import './App.css'
import FeaturesSection from './components/FeatureSection/FeaturesSection'
import ProductSection from './components/ProductSection/ProductSection'
import OfferSection from './components/OfferSection/OfferSection'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Homepage from './pages/Homepage/Homepage'

function App() {

  return (
    <>  
      <Navbar/>
      <Routes>
        <Route path="/" element={<Homepage/>}/>
      </Routes>
    </>
  )
}

export default App
