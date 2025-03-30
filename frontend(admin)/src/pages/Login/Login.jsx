import { useState } from 'react';
import './Login.css';
import { useAuth } from '../../context/authContext';

function Login() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const {login} = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!credentials.username || !credentials.password) {
      setError('Please enter both username and password');
      return;
    }
    
    try {
      const result = await login(credentials);
      if(!result.success){
        setError(result.message);
        return;
      }
      setError('');
    } catch (error) {
      setError(error.message || 'An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <h1>Admin Login</h1>
        <form className="login-form" onSubmit={handleSubmit}>
         
          
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              placeholder="Enter your username"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;