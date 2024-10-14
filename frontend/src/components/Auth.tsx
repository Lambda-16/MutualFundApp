import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Auth: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await api.post('/user/register', {
        email_id: email,
        password: password
      });
      console.log('Registration Success:', response.data);
      setIsRegister(false);
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await api.post('/user/login', {
        email_id: email,
        password: password
      });
      const { access_token, token_type } = response.data;
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('token_type', token_type);
      console.log('Login Success:', response.data);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div>
      <h1>Welcome</h1>
      {!isRegister ? (
        <div>
          <h2>Login</h2>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button onClick={handleLogin}>Login</button>
          <p>Don't have an account? <button onClick={() => setIsRegister(true)}>Register</button></p>
        </div>
      ) : (
        <div>
          <h2>Register</h2>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button onClick={handleRegister}>Submit</button>
          <p>Already have an account? <button onClick={() => setIsRegister(false)}>Login</button></p>
        </div>
      )}
    </div>
  );
};

export default Auth;