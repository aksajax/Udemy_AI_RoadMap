import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import CourseView from './pages/CourseView';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';

// --- Improved Protected Route Logic ---
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem('access_token');
  const userRole = localStorage.getItem('user_role'); // 'admin' ya 'student'

  // 1. Agar login hi nahi hai, toh Login page par bhejo
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Agar Admin page hai par user admin nahi hai
  // Humne "student" check ko flexible rakha hai
  if (adminOnly && userRole !== 'admin') {
    console.log("Access Denied: You are not an admin");
    return <Navigate to="/" replace />; 
  }

  return children;
};

// --- Public Route Guard ---
// Isse agar user pehle se login hai, toh wo wapas Login/Register page nahi dekh payega
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />

        {/* --- Private Routes (Students & Admins both) --- */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/course/:id" 
          element={
            <ProtectedRoute>
              <CourseView />
            </ProtectedRoute>
          } 
        />

        {/* --- Admin ONLY Route --- */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute adminOnly={true}>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        {/* --- 404 Route --- */}
        <Route path="*" element={
          <div className="h-screen bg-gray-950 flex flex-col items-center justify-center text-white">
            <h1 className="text-6xl font-bold text-blue-500">404</h1>
            <p className="text-gray-400 mt-4">Bhai, galat raste aa gaye ho!</p>
            <button 
              onClick={() => window.location.href = "/"}
              className="mt-6 px-6 py-2 bg-blue-600 rounded-lg"
            >
              Ghar Chalo (Home)
            </button>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;