import './App.css'
import { useAuth } from './context/authContext';
import Login from './pages/Login/Login'
import Dashboard from './pages/Dashboard/Dashboard'

function App() {

  const {isAuthenticated} = useAuth();

  if(!isAuthenticated){
    return <Login/>
  }

  return (
      <Dashboard/>
  )
}

export default App
