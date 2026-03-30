import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, GraduationCap, LogOut, LogIn, User } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // --- Auth Checks ---
  const token = localStorage.getItem('access_token');
  const userRole = localStorage.getItem('user_role');
  const username = localStorage.getItem('username') || "User";

  const handleLogout = () => {
    localStorage.clear(); // Saara data (token, role, name) saaf
    navigate('/login');
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-[#0b0f1a]/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <div 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="bg-blue-600 p-2 rounded-lg group-hover:rotate-12 transition-transform">
            <GraduationCap className="text-white" size={24} />
          </div>
          <span className="text-xl font-black tracking-tighter text-white">
            COURSE<span className="text-blue-500">AI</span>
          </span>
        </div>

        {/* Nav Links - Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <button 
            onClick={() => navigate('/')} 
            className="text-gray-400 hover:text-white font-medium text-sm transition-colors"
          >
            Home
          </button>

          {/* 1. Dashboard Link - Sirf Admin ko dikhega */}
          {token && userRole === 'admin' && (
            <button 
              onClick={() => navigate('/dashboard')} 
              className="px-5 py-2.5 bg-blue-600/10 hover:bg-blue-600 text-blue-500 hover:text-white border border-blue-600/30 rounded-xl text-sm font-bold transition-all active:scale-95"
            >
              Admin Dashboard
            </button>
          )}

          <div className="h-6 w-[1px] bg-gray-800 mx-2"></div>

          {/* 2. Login vs Logout Toggle */}
          {token ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-300 bg-gray-900/50 px-3 py-1.5 rounded-lg border border-gray-800">
                <User size={16} className="text-blue-500" />
                <span className="text-xs font-semibold capitalize">{username}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-400 hover:text-red-500 font-bold text-sm transition-colors"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          ) : (
            <button 
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-600/20"
            >
              <LogIn size={18} />
              Login
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-gray-400" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#0b0f1a] border-b border-gray-800 p-6 space-y-4 animate-in slide-in-from-top duration-300 shadow-2xl">
          <button 
            onClick={() => { navigate('/'); setIsMenuOpen(false); }} 
            className="block w-full text-left text-gray-400 py-2 hover:text-white"
          >
            Home
          </button>
          
          {token && userRole === 'admin' && (
            <button 
              onClick={() => { navigate('/dashboard'); setIsMenuOpen(false); }} 
              className="block w-full text-left text-blue-400 py-2"
            >
              Admin Dashboard
            </button>
          )}

          {token ? (
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-red-600/10 text-red-500 py-3 rounded-xl font-bold"
            >
              <LogOut size={18} /> Logout
            </button>
          ) : (
            <button 
              onClick={() => { navigate('/login'); setIsMenuOpen(false); }} 
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-bold"
            >
              <LogIn size={18} /> Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;