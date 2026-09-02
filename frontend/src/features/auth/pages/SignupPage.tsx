import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../api/auth.api';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { firstName, lastName, email, mobile, password, confirmPassword } = form;

    if (!firstName || !lastName || !email || !mobile || !password) {
      setError('All fields are required.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setError('');
    setIsLoading(true);
    try {
      await signup({ firstName, lastName, email, mobile, password });
      navigate('/login', { replace: true, state: { registered: true } });
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-orb auth-bg-orb--1" />
      <div className="auth-bg-orb auth-bg-orb--2" />
      <div className="auth-bg-orb auth-bg-orb--3" />

      <div className="auth-card auth-card--wide">
        {/* Brand */}
        <div className="auth-brand">
          <div className="auth-logo">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="10" fill="url(#logoGrad2)" />
              <path d="M8 16C8 11.58 11.58 8 16 8C18.21 8 20.21 8.9 21.66 10.34L24 8C21.96 6.09 19.12 5 16 5C9.92 5 5 9.92 5 16C5 22.08 9.92 27 16 27C19.12 27 21.96 25.91 24 24L21.66 21.66C20.21 23.1 18.21 24 16 24C11.58 24 8 20.42 8 16Z" fill="white" opacity="0.9"/>
              <circle cx="22" cy="16" r="4" fill="white" opacity="0.7"/>
              <defs>
                <linearGradient id="logoGrad2" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#6366f1"/>
                  <stop offset="1" stopColor="#8b5cf6"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div>
            <h1 className="auth-brand-name">NexusCRM</h1>
            <p className="auth-brand-tagline">Enterprise Sales Intelligence</p>
          </div>
        </div>

        <div className="auth-header">
          <h2 className="auth-title">Create your account</h2>
          <p className="auth-subtitle">Get started with your free CRM workspace</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} id="signup-form">
          <div className="auth-field-row">
            <div className="auth-field">
              <label className="auth-label" htmlFor="signup-firstname">First Name</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </span>
                <input id="signup-firstname" className="auth-input" type="text" placeholder="John" value={form.firstName} onChange={update('firstName')} disabled={isLoading} />
              </div>
            </div>
            <div className="auth-field">
              <label className="auth-label" htmlFor="signup-lastname">Last Name</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </span>
                <input id="signup-lastname" className="auth-input" type="text" placeholder="Doe" value={form.lastName} onChange={update('lastName')} disabled={isLoading} />
              </div>
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="signup-email">Email Address</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </span>
              <input id="signup-email" className="auth-input" type="email" placeholder="john@example.com" value={form.email} onChange={update('email')} autoComplete="email" disabled={isLoading} />
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="signup-mobile">Mobile Number</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                  <line x1="12" y1="18" x2="12.01" y2="18"/>
                </svg>
              </span>
              <input id="signup-mobile" className="auth-input" type="tel" placeholder="+1 (555) 000-0000" value={form.mobile} onChange={update('mobile')} autoComplete="tel" disabled={isLoading} />
            </div>
          </div>

          <div className="auth-field-row">
            <div className="auth-field">
              <label className="auth-label" htmlFor="signup-password">Password</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input id="signup-password" className="auth-input" type={showPassword ? 'text' : 'password'} placeholder="Min. 8 characters" value={form.password} onChange={update('password')} autoComplete="new-password" disabled={isLoading} />
                <button type="button" className="auth-pw-toggle" onClick={() => setShowPassword(v => !v)} tabIndex={-1} aria-label="Toggle password">
                  {showPassword
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
            </div>
            <div className="auth-field">
              <label className="auth-label" htmlFor="signup-confirm">Confirm Password</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </span>
                <input id="signup-confirm" className="auth-input" type={showPassword ? 'text' : 'password'} placeholder="Re-enter password" value={form.confirmPassword} onChange={update('confirmPassword')} autoComplete="new-password" disabled={isLoading} />
              </div>
            </div>
          </div>

          {/* Password strength indicator */}
          {form.password && (
            <div className="auth-strength">
              <div className={`auth-strength-bar${form.password.length >= 12 ? ' strong' : form.password.length >= 8 ? ' medium' : ' weak'}`} />
              <span className="auth-strength-label">
                {form.password.length >= 12 ? 'Strong' : form.password.length >= 8 ? 'Fair' : 'Weak'}
              </span>
            </div>
          )}

          {error && (
            <div className="auth-error" role="alert">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              {error}
            </div>
          )}

          <button type="submit" id="signup-submit" className={`auth-btn${isLoading ? ' auth-btn--loading' : ''}`} disabled={isLoading}>
            {isLoading ? (
              <><span className="auth-btn-spinner" />Creating account...</>
            ) : (
              <>
                Create account
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </>
            )}
          </button>
        </form>

        <div className="auth-divider"><span>Already have an account?</span></div>
        <Link to="/login" className="auth-secondary-btn">Sign in instead</Link>

        <p className="auth-footer">
          By creating an account, you agree to our Terms of Service &amp; Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
