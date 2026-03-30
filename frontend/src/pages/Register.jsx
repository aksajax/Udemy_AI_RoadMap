import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { User, Mail, Phone, Lock, UserPlus, Loader2, AlertCircle, GraduationCap, ShieldCheck } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone_number: '',
    password: '',
    is_admin: false // Default role Student rahega
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    setError("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validation: Phone 10 digits ka hi hona chahiye
    if (formData.phone_number.length !== 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Backend Endpoint: /api/auth/register/
      await api.post('auth/register/', formData);
      alert("Registration Successful! Please Login.");
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed. Try a different username or phone.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a] flex flex-col items-center justify-center px-6 py-12">
      
      {/* Logo Area */}
      <div className="flex items-center gap-3 mb-8 cursor-pointer" onClick={() => navigate('/')}>
        <div className="bg-blue-600 p-2.5 rounded-2xl">
          <GraduationCap className="text-white" size={28} />
        </div>
        <span className="text-2xl font-black tracking-tighter text-white">
          COURSE<span className="text-blue-500">AI</span>
        </span>
      </div>

      <div className="w-full max-w-lg">
        <div className="bg-[#161b22] border border-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-white mb-2">Create Account</h2>
            <p className="text-gray-400 text-sm">Join the community and start learning</p>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Username */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 ml-1">USERNAME</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500" size={18} />
                <input
                  type="text"
                  name="username"
                  placeholder="john_doe"
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-900 border border-gray-800 text-white pl-12 pr-4 py-3.5 rounded-2xl focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 ml-1">EMAIL ADDRESS</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500" size={18} />
                <input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-900 border border-gray-800 text-white pl-12 pr-4 py-3.5 rounded-2xl focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all text-sm"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 ml-1">PHONE NUMBER</label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500" size={18} />
                <input
                  type="tel"
                  name="phone_number"
                  placeholder="10-digit number"
                  maxLength="10"
                  onChange={(e) => setFormData({...formData, phone_number: e.target.value.replace(/\D/g, '')})}
                  value={formData.phone_number}
                  required
                  className="w-full bg-gray-900 border border-gray-800 text-white pl-12 pr-4 py-3.5 rounded-2xl focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 ml-1">PASSWORD</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500" size={18} />
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-900 border border-gray-800 text-white pl-12 pr-4 py-3.5 rounded-2xl focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all text-sm"
                />
              </div>
            </div>

            {/* Role Selection (Admin Checkbox) */}
            <div className="md:col-span-2 flex items-center gap-3 p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
              <input
                type="checkbox"
                name="is_admin"
                id="is_admin"
                checked={formData.is_admin}
                onChange={handleChange}
                className="w-5 h-5 accent-blue-600 rounded-md cursor-pointer"
              />
              <label htmlFor="is_admin" className="text-sm text-gray-300 cursor-pointer flex items-center gap-2">
                <ShieldCheck size={16} className="text-blue-500" />
                Register as Instructor / Admin
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="md:col-span-2 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg shadow-blue-600/20 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  Register Now
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-gray-500 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 font-bold hover:underline">
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;