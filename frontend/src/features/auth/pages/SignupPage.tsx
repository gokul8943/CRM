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
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        {/* Brand */}
        <div className="flex flex-col items-center">
          <h1 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
            CRM
          </h1>
          <p className="mt-2 text-center text-sm text-slate-500">
            Enterprise Sales Intelligence
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
          <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200 sm:rounded-xl sm:px-10 border border-slate-200">
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-slate-900">Create your account</h2>
              <p className="text-sm text-slate-500">Get started with your free CRM workspace</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit} id="signup-form">
              {/* Name Fields Row */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700" htmlFor="signup-firstname">First Name</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </span>
                    <input
                      id="signup-firstname"
                      className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 sm:text-sm placeholder-slate-400 transition-colors"
                      type="text"
                      placeholder="John"
                      value={form.firstName}
                      onChange={update('firstName')}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700" htmlFor="signup-lastname">Last Name</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </span>
                    <input
                      id="signup-lastname"
                      className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 sm:text-sm placeholder-slate-400 transition-colors"
                      type="text"
                      placeholder="Doe"
                      value={form.lastName}
                      onChange={update('lastName')}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-slate-700" htmlFor="signup-email">Email Address</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </span>
                  <input
                    id="signup-email"
                    className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 sm:text-sm placeholder-slate-400 transition-colors"
                    type="email"
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={update('email')}
                    autoComplete="email"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Mobile Field */}
              <div>
                <label className="block text-sm font-medium text-slate-700" htmlFor="signup-mobile">Mobile Number</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                      <line x1="12" y1="18" x2="12.01" y2="18" />
                    </svg>
                  </span>
                  <input
                    id="signup-mobile"
                    className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 sm:text-sm placeholder-slate-400 transition-colors"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={form.mobile}
                    onChange={update('mobile')}
                    autoComplete="tel"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Fields Row */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700" htmlFor="signup-password">Password</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </span>
                    <input
                      id="signup-password"
                      className="block w-full pl-10 pr-10 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 sm:text-sm placeholder-slate-400 transition-colors"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min. 8 characters"
                      value={form.password}
                      onChange={update('password')}
                      autoComplete="new-password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                      onClick={() => setShowPassword(v => !v)}
                      tabIndex={-1}
                      aria-label="Toggle password"
                    >
                      {showPassword ? (
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700" htmlFor="signup-confirm">Confirm Password</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    <input
                      id="signup-confirm"
                      className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 sm:text-sm placeholder-slate-400 transition-colors"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Re-enter password"
                      value={form.confirmPassword}
                      onChange={update('confirmPassword')}
                      autoComplete="new-password"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Password strength indicator */}
              {form.password && (
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex-1 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${form.password.length >= 12 ? 'w-full bg-green-500' :
                        form.password.length >= 8 ? 'w-2/3 bg-yellow-500' : 'w-1/3 bg-red-500'
                        }`}
                    />
                  </div>
                  <span className={`text-xs font-medium ${form.password.length >= 12 ? 'text-green-600' :
                    form.password.length >= 8 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                    {form.password.length >= 12 ? 'Strong' : form.password.length >= 8 ? 'Fair' : 'Weak'}
                  </span>
                </div>
              )}

              {/* Error Alert */}
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-start" role="alert">
                  <svg className="h-5 w-5 text-red-500 mt-0.5 mr-2 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                id="signup-submit"
                className="w-full flex justify-center items-center py-2.5 px-4 mt-6 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <svg className="ml-2 -mr-1 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-slate-500">Already have an account?</span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  to="/login"
                  className="w-full flex justify-center py-2.5 px-4 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors"
                >
                  Sign in instead
                </Link>
              </div>
            </div>

            <p className="mt-8 text-center text-xs text-slate-400">
              By creating an account, you agree to our Terms of Service & Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;