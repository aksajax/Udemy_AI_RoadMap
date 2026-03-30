import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig'; 
import { Phone, Lock, LogIn, Loader2, AlertCircle } from 'lucide-react';

const Login = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Agar user pehle se logged in hai, toh usey seedha bhej do
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const role = localStorage.getItem('user_role');
    if (token) {
      if (role === 'admin') navigate('/dashboard');
      else navigate('/');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (phone.length !== 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    setError("");
    
    // 1. Purana session saaf karo (Conflict se bachne ke liye)
    localStorage.clear();

    try {
      const response = await api.post('auth/login/', {
        phone_number: phone,
        password: password
      });

      console.log("Login Success Response:", response.data);

      // --- 2. TOKEN STORAGE (Axios isi key ko dhoondega) ---
      const { access, refresh, is_admin, username } = response.data;

      if (access) {
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        localStorage.setItem('username', username || "User");
        
        // --- 3. ROLE STORAGE (Strict Boolean Check) ---
        const isAdmin = is_admin === true || is_admin === "true";
        localStorage.setItem('user_role', isAdmin ? 'admin' : 'student');

        // --- 4. REDIRECTION ---
        if (isAdmin) {
          navigate('/dashboard');
        } else {
          navigate('/');
        }
      } else {
        setError("Token not received. Contact Admin.");
      }

    } catch (err) {
      console.error("Login Error:", err.response?.data);
      setError(err.response?.data?.detail || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center px-4 font-sans">
      <div className="w-full max-w-md bg-[#161b22] border border-gray-800 rounded-[2.5rem] p-10 shadow-2xl">
        
        <div className="text-center mb-8">
          <div className="bg-blue-600/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
            <LogIn className="text-blue-500" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Login</h2>
          <p className="text-gray-500 text-sm italic">Access your dashboard with your number</p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-sm">
            <AlertCircle size={20} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Phone Input */}
          <div className="relative group">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500" size={20} />
            <input
              type="tel"
              placeholder="10-Digit Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              className="w-full bg-gray-900 border border-gray-800 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-blue-500 transition-all shadow-inner"
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500" size={20} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-blue-500 transition-all shadow-inner"
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <LogIn size={20} />}
            {loading ? "Verifying..." : "Login Now"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            New here? <Link to="/register" className="text-blue-500 hover:underline">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;