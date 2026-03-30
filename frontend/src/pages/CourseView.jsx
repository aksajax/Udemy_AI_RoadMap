import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import VideoPlayer from '../components/VideoPlayer';
import { Pencil, Trash2, X, Save } from 'lucide-react';

const CourseView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [currentVideo, setCurrentVideo] = useState("");
  
  // Role checking
  const userRole = localStorage.getItem('user_role');
  const isAdmin = userRole === 'admin';

  // Edit State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({ title: '', description: '' });

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  const fetchCourseData = () => {
    api.get(`courses/${id}/content/`).then(res => {
      setCourse(res.data);
      setEditData({ title: res.data.title, description: res.data.description });
      if(res.data.sections[0]?.lectures[0]) {
        setCurrentVideo(res.data.sections[0].lectures[0].video_url);
      }
    }).catch(err => console.error("Error fetching course:", err));
  };

  // --- Handlers for Admin ---
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`courses/${id}/`, editData);
      setIsEditModalOpen(false);
      fetchCourseData(); // Refresh data
      alert("Course updated successfully!");
    } catch (err) {
      alert("Failed to update course.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this entire course?")) {
      try {
        await api.delete(`courses/${id}/`);
        navigate('/'); // Redirect to home after delete
      } catch (err) {
        alert("Failed to delete course.");
      }
    }
  };

  if (!course) return <div className="h-screen flex items-center justify-center bg-gray-950 text-white font-mono">Loading...</div>;

  return (
    <div className="h-screen flex flex-col bg-gray-950 text-white">
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="flex justify-between items-start mb-6">
            <VideoPlayer url={currentVideo} title={course.title} />
            
            {/* Admin Controls Area */}
            {isAdmin && (
              <div className="flex gap-2 ml-4">
                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="p-3 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white rounded-xl transition-all"
                  title="Edit Course"
                >
                  <Pencil size={20} />
                </button>
                <button 
                  onClick={handleDelete}
                  className="p-3 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white rounded-xl transition-all"
                  title="Delete Course"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            )}
          </div>

          <div className="mt-8 border-t border-gray-800 pt-6">
            <h3 className="text-2xl font-bold text-white">{course.title}</h3>
            <p className="text-gray-400 mt-3 leading-relaxed">{course.description}</p>
          </div>
        </div>

        {/* Sidebar */}
        <Sidebar 
          sections={course.sections} 
          onLectureSelect={setCurrentVideo} 
          currentVideo={currentVideo}
        />
      </div>

      {/* --- Simple Edit Modal --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161b22] border border-gray-800 w-full max-w-lg rounded-3xl p-8 shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Edit Course Details</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-500 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-5">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Course Title</label>
                <input 
                  type="text"
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl p-4 mt-1 focus:border-blue-500 outline-none transition-all"
                  value={editData.title}
                  onChange={(e) => setEditData({...editData, title: e.target.value})}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Description</label>
                <textarea 
                  rows="4"
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl p-4 mt-1 focus:border-blue-500 outline-none transition-all resize-none"
                  value={editData.description}
                  onChange={(e) => setEditData({...editData, description: e.target.value})}
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Save size={18} /> Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseView;