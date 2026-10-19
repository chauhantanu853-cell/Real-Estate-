import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { registerUser } from '../services/api';
import { HiMail, HiLockClosed, HiUser, HiPhone, HiEye, HiEyeOff } from 'react-icons/hi';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'buyer', phone: '',
  });
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
      const { data } = await registerUser(formData);
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page page-wrapper">
      <div className="auth-container animate-fade-in-up">
        <div className="auth-card glass-card">
          <div className="auth-header">
            <h1>Create Account</h1>
            <p>Join DreamHome today</p>
          </div>
          {error && <div className="auth-error">{error}</div>}
          <form onSubmit={handleSubmit} id="register-form">
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-icon-wrapper">
                <HiUser className="input-icon" />
                <input type="text" className="form-input" placeholder="John Doe"
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required id="register-name" />
              </div>
            </div>
            <div className="form-group">
              <label>Email</label>
              <div className="input-icon-wrapper">
                <HiMail className="input-icon" />
                <input type="email" className="form-input" placeholder="you@example.com"
                  value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required id="register-email" />
              </div>
            </div>
            <div className="form-group">
              <label>Phone</label>
              <div className="input-icon-wrapper">
                <HiPhone className="input-icon" />
                <input type="tel" className="form-input" placeholder="+91 98765 43210"
                  value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} id="register-phone" />
              </div>
            </div>
            <div className="form-group">
              <label>I want to</label>
              <select className="form-input" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} id="register-role">
                <option value="buyer">Buy Property</option>
                <option value="seller">Sell Property</option>
              </select>
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="input-icon-wrapper">
                <HiLockClosed className="input-icon" />
                <input type={showPassword ? 'text' : 'password'} className="form-input" placeholder="Min 6 characters"
                  value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required minLength={6} id="register-password" />
                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <HiEyeOff /> : <HiEye />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading} id="register-submit">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
