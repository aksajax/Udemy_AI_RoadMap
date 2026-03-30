import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import Navbar from '../components/Navbar';
import CourseCard from '../components/CourseCard';
import { Sparkles, Search, Library, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const Home = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  

  useEffect(() => {
    
    api.get('courses/')
      .then(res => {
        setCourses(res.data);
        setFilteredCourses(res.data); // Initial state mein saare courses dikhenge
        setLoading(false);
      })
      .catch(err => {
        console.error("Data fetch error:", err);
        setLoading(false);
      });
    
  }, []);
  

  // Live Filtering Logic
  useEffect(() => {
    const results = courses.filter(course =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourses(results);
  }, [searchTerm, courses]);

  // Enter click karne par sabse best match par le jana
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (filteredCourses.length > 0) {
      // Pehla jo match mila us par navigate kar jao
      navigate(`/course/${filteredCourses[0].id}`);
    } else {
      alert("No matching course found!");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white font-sans">
      <Navbar />

      {/* Hero & Smart Search Section */}
      <section className="pt-20 pb-12 px-6 text-center bg-gradient-to-b from-blue-900/20 to-transparent">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold mb-6">
            <Sparkles size={14} /> AI-POWERED DISCOVERY
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-8 tracking-tight">
            What do you want to <span className="text-blue-500">Learn</span> today?
          </h1>

          {/* Search Bar Professional UI */}
          <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <Search className={`transition-colors ${searchTerm ? 'text-blue-500' : 'text-gray-500'}`} size={20} />
            </div>
            <input
              type="text"
              placeholder="Search courses (e.g. MERN, Python, React)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#161b22] border-2 border-gray-800 text-white pl-14 pr-12 py-5 rounded-2xl focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all text-lg shadow-2xl"
            />
            {searchTerm && (
              <button 
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-5 flex items-center text-gray-500 hover:text-white"
              >
                <X size={20} />
              </button>
            )}
          </form>
          
          <p className="mt-4 text-gray-500 text-sm italic">
            Tip: Press <span className="bg-gray-800 px-2 py-0.5 rounded text-gray-300">Enter</span> to jump to the best match.
          </p>
        </div>
      </section>

      {/* Course Grid */}
      <main className="max-w-7xl mx-auto px-6 pb-20">
        <div className="flex items-center justify-between mb-10 border-b border-gray-800 pb-6">
          <div className="flex items-center gap-3">
            <Library className="text-blue-500" size={24} />
            <h2 className="text-2xl font-bold">
              {searchTerm ? `Results for "${searchTerm}"` : "Our Roadmaps"}
            </h2>
          </div>
          <span className="text-gray-500 text-sm">{filteredCourses.length} Courses</span>
        </div>

        {loading ? (
          <div className="text-center py-20 text-blue-500 animate-pulse">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 transition-all duration-500">
            {filteredCourses.length > 0 ? (
              filteredCourses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-gray-900/30 rounded-3xl border border-dashed border-gray-800">
                <p className="text-gray-500 text-lg">Oops! No courses match your search.</p>
                <button onClick={() => setSearchTerm("")} className="mt-4 text-blue-500 hover:underline">Clear Search</button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;