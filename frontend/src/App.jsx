import './App.css'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Homepage from './pages/HomePage/Homepage'

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
