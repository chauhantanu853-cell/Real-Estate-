import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { loginUser } from '../services/api';
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await loginUser(formData);
      login(data);
      if (data.role === 'admin') navigate('/admin');
      else if (data.role === 'seller') navigate('/seller');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page page-wrapper">
      <div className="auth-container animate-fade-in-up">
        <div className="auth-card glass-card">
          <div className="auth-header">
            <h1>Welcome Back</h1>
            <p>Sign in to your account</p>
          </div>
          {error && <div className="auth-error">{error}</div>}
          <form onSubmit={handleSubmit} id="login-form">
            <div className="form-group">
              <label>Email</label>
              <div className="input-icon-wrapper">
                <HiMail className="input-icon" />
                <input
                  type="email"
                  className="form-input"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  id="login-email"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="input-icon-wrapper">
                <HiLockClosed className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                  id="login-password"
                />
                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <HiEyeOff /> : <HiEye />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading} id="login-submit">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="auth-switch">
            Don't have an account? <Link to="/register">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
