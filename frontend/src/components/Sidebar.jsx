import React, { useState } from 'react';
import { ChevronDown, ChevronUp, PlayCircle } from 'lucide-react';

const Sidebar = ({ sections, onLectureSelect, currentVideo }) => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <aside className="w-96 bg-gray-900 border-l border-gray-800 h-[calc(100vh-64px)] overflow-y-auto">
      <div className="p-4 font-bold text-lg border-b border-gray-800">Course Content</div>
      {sections?.map((section, idx) => (
        <div key={section.id} className="border-b border-gray-800">
          <button 
            onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
            className="w-full p-4 flex justify-between items-center hover:bg-gray-800 transition text-left"
          >
            <span className="font-medium">Section {idx + 1}: {section.title}</span>
            {openIndex === idx ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
          </button>
          
          {openIndex === idx && (
            <div className="bg-black/40">
              {section.lectures.map((lec) => (
                <div 
                  key={lec.id}
                  onClick={() => onLectureSelect(lec.video_url)}
                  className={`p-4 pl-8 flex items-center gap-3 cursor-pointer hover:bg-blue-900/20 border-l-4 transition ${currentVideo === lec.video_url ? 'border-blue-500 bg-blue-900/10 text-blue-400' : 'border-transparent text-gray-400'}`}
                >
                  <PlayCircle size={16} />
                  <span className="text-sm">{lec.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </aside>
  );
};

export default Sidebar;