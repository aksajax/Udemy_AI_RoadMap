import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import Navbar from '../components/Navbar';
import { 
  PlusCircle, Pencil, Trash2, X, Save, 
  LayoutDashboard, BookOpen, Loader2, AlertCircle, Upload 
} from 'lucide-react';

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // --- Form States ---
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '',
    is_published: true 
  });
  const [thumbnailFile, setThumbnailFile] = useState(null); // File ke liye alag state
  const [currentCourseId, setCurrentCourseId] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get('courses/');
      setCourses(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // 1. Create FormData instance for File + Text
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('is_published', formData.is_published);
    
    // Sirf tab add karein jab file select ki gayi ho
    if (thumbnailFile) {
      data.append('thumbnail', thumbnailFile);
    }

    try {
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      };

      if (isEditModalOpen) {
        await api.put(`courses/${currentCourseId}/`, data, config);
        alert("Course Updated! ✨");
      } else {
        await api.post('courses/', data, config);
        alert("Course Created Successfully! 🎉");
      }
      
      closeModals();
      fetchCourses();
    } catch (err) {
      console.error("API Error:", err.response?.data);
      setError(err.response?.data?.detail || "Action failed. Check if you are an Admin and all fields are valid.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this course?")) {
      try {
        await api.delete(`courses/${id}/`);
        fetchCourses();
      } catch (err) { alert("Delete failed."); }
    }
  };

  const openEditModal = (course) => {
    setCurrentCourseId(course.id);
    setFormData({ 
      title: course.title, 
      description: course.description,
      is_published: course.is_published ?? true
    });
    setThumbnailFile(null); // Purani file clear karein
    setIsEditModalOpen(true);
  };

  const closeModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setFormData({ title: '', description: '', is_published: true });
    setThumbnailFile(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto p-8">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-extrabold flex items-center gap-3 italic">
              <LayoutDashboard className="text-blue-500" size={32} />
              ADMIN PANEL
            </h1>
          </div>
          <button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all active:scale-95">
            <PlusCircle size={20} /> Add Course
          </button>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <div className="bg-[#161b22] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead className="bg-gray-900/50 text-gray-400 text-xs uppercase tracking-widest">
              <tr>
                <th className="p-6">Course Name</th>
                <th className="p-6">Status</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {courses.map(course => (
                <tr key={course.id} className="hover:bg-gray-800/30 transition-all group">
                  <td className="p-6 font-bold">{course.title}</td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${course.is_published ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                      {course.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="p-6 text-right flex justify-end gap-2">
                    <button onClick={() => openEditModal(course)} className="p-2.5 bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white rounded-xl"><Pencil size={18}/></button>
                    <button onClick={() => handleDelete(course.id)} className="p-2.5 bg-red-600/10 text-red-400 hover:bg-red-600 hover:text-white rounded-xl"><Trash2 size={18}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL --- */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#161b22] border border-gray-800 w-full max-w-xl rounded-[2.5rem] p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-blue-500">{isEditModalOpen ? "Update Course" : "New Course Details"}</h2>
              <button onClick={closeModals} className="text-gray-500 hover:text-white bg-gray-800 p-2 rounded-full"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Course Title</label>
                <input type="text" className="w-full bg-gray-900 border border-gray-800 rounded-2xl p-4 mt-2 focus:border-blue-500 outline-none transition-all" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Description</label>
                <textarea rows="4" className="w-full bg-gray-900 border border-gray-800 rounded-2xl p-4 mt-2 focus:border-blue-500 outline-none transition-all resize-none" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
              </div>

              {/* IMAGE FILE INPUT */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Thumbnail Image</label>
                <div className="mt-2 flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-800 border-dashed rounded-2xl cursor-pointer bg-gray-900 hover:bg-gray-800 hover:border-blue-500 transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="text-gray-500 mb-2" size={24} />
                      <p className="text-sm text-gray-500">
                        {thumbnailFile ? thumbnailFile.name : "Select Image File"}
                      </p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={(e) => setThumbnailFile(e.target.files[0])}
                      required={!isEditModalOpen} // Create ke waqt zaroori hai
                    />
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-gray-900/50 p-4 rounded-2xl border border-gray-800">
                <input type="checkbox" id="pub" className="w-5 h-5 accent-blue-600" checked={formData.is_published} onChange={(e) => setFormData({...formData, is_published: e.target.checked})} />
                <label htmlFor="pub" className="text-sm text-gray-400">Published Status</label>
              </div>
              
              <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-600/30 disabled:opacity-50">
                {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                {isEditModalOpen ? "Save Changes" : "Create Now"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 