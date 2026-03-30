import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, ArrowRight, Star } from 'lucide-react';

const CourseCard = ({ course }) => {
  const navigate = useNavigate();

  // Agar backend se description nahi aa raha toh default text
  const defaultDesc = "Master this technology with our AI-curated professional roadmap and hands-on projects.";

  return (
    <div 
      onClick={() => navigate(`/course/${course.id}`)}
      className="group relative bg-[#1e293b]/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-5 hover:border-blue-500/50 transition-all duration-500 hover:shadow-[0_20px_50px_-20px_rgba(59,130,246,0.3)] cursor-pointer overflow-hidden"
    >
      {/* Background Decor (Subtle Glow) */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 blur-[100px] group-hover:bg-blue-600/20 transition-colors duration-500"></div>

      {/* Image Container */}
      <div className="relative h-44 w-full bg-gray-800 rounded-2xl mb-5 overflow-hidden">
        {/* <img 
          src={course.thumbnail || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000"} 
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
        /> */}
        <img 
  src={`http://127.0.0.1:8000${course.thumbnail}`} 
  alt={course.title} 
  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
/>
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg border border-white/10 flex items-center gap-1">
          <Star size={10} className="text-yellow-400 fill-yellow-400" /> 4.8
        </div>
      </div>

      {/* Course Info */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-blue-400 text-[10px] font-bold uppercase tracking-widest">
          <BookOpen size={12} />
          <span>Professional Track</span>
        </div>

        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
          {course.title}
        </h3>

        <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed h-10">
          {course.description || defaultDesc}
        </p>

        {/* Stats Row */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-800 mt-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-gray-500 text-xs">
              <Clock size={14} />
              <span>Self-paced</span>
            </div>
          </div>
          <span className="text-blue-500 font-bold text-sm">FREE</span>
        </div>

        {/* Action Button (Visible on Hover mostly, but styled for all) */}
        <div className="pt-2">
          <button className="w-full py-3 bg-gray-800 group-hover:bg-blue-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 transform active:scale-95">
            View Roadmap
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;