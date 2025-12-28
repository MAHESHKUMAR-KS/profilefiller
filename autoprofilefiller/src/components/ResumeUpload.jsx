import React, { useState } from "react";

const Field = ({ label, value, textarea, autoFilled }) => {
  // Convert value to string properly for display
  let displayValue = '';
  if (value === null || value === undefined) {
    displayValue = '';
  } else if (typeof value === 'object') {
    if (Array.isArray(value)) {
      // If it's an array, handle differently based on element type
      if (value.length === 0) {
        displayValue = '';
      } else if (typeof value[0] === 'object') {
        // If array contains objects (like education, experience, projects), format them nicely
        displayValue = value.map(item => {
          if (typeof item === 'object') {
            // Format object properties - try common fields for education, experience, projects
            const parts = [];
            if (item.institution || item.school || item.university) {
              parts.push(item.institution || item.school || item.university);
            }
            if (item.degree || item.course) {
              parts.push(item.degree || item.course);
            }
            if (item.duration || item.dates || item.time_period) {
              parts.push(item.duration || item.dates || item.time_period);
            }
            if (item.company || item.organization) {
              parts.push(item.company || item.organization);
            }
            if (item.position || item.role || item.title) {
              parts.push(item.position || item.role || item.title);
            }
            if (item.description || item.details) {
              parts.push(item.description || item.details);
            }
            if (item.name || item.project_name) {
              parts.push(item.name || item.project_name);
            }
            return parts.join(' - ');
          } else {
            return String(item);
          }
        }).join('\n\n');
      } else {
        // If it's an array of primitives, join with newlines
        displayValue = value.join('\n');
      }
    } else {
      // If it's an object, convert to string
      displayValue = JSON.stringify(value);
    }
  } else {
    // If it's a primitive, convert to string
    displayValue = String(value);
  }
  
  const filled = displayValue && displayValue.length > 0;
  
  return (
    <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 p-4 transition-all duration-300 hover:shadow-md">
      <div className="flex justify-between items-center mb-2">
        <label className="font-bold text-gray-800 text-base flex items-center">
          <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          {label}
        </label>
        <span className={`text-xs px-3 py-1 rounded-full font-bold ${filled ? (autoFilled ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md" : "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md") : "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md"}`}>
          {filled ? (autoFilled ? "Auto-filled" : "Filled") : "Needs review"}
        </span>
      </div>
      {textarea ? (
        <textarea 
          readOnly 
          value={displayValue} 
          rows={4} 
          className={`w-full p-4 rounded-lg border-2 transition-all duration-300 focus:ring-4 focus:ring-opacity-50 ${!filled ? "bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200 focus:ring-amber-300" : "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 focus:ring-blue-300"}`} 
        />
      ) : (
        <input 
          readOnly 
          value={displayValue} 
          className={`w-full p-4 rounded-lg border-2 transition-all duration-300 focus:ring-4 focus:ring-opacity-50 ${!filled ? "bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200 focus:ring-amber-300" : "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 focus:ring-blue-300"}`} 
        />
      )}
    </div>
  );
};

export default function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const upload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const fd = new FormData();
      fd.append("resume", file);
      const res = await fetch("http://localhost:5000/api/resume/parse", {
        method: "POST",
        body: fd
      });
      
      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }
      
      const data = await res.json();
      
      if (data.success) {
        setProfile(data.profile);
        alert('Resume parsed and form auto-filled successfully!');
      } else {
        throw new Error(data.message || 'Failed to parse resume');
      }
    } catch (err) {
      setError(err.message);
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-1 bg-gradient-to-r from-white/20 to-white/10 rounded-3xl backdrop-blur-sm">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-6 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 mb-4">AI Resume Parser</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">Upload your resume in PDF or DOCX format to auto-fill your profile with intelligent parsing</p>
            </div>
            
            <div className="flex flex-col items-center mb-10">
              <div className="w-full max-w-md mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  Select Resume File
                </label>
                <div className="relative">
                  <input 
                    type="file" 
                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={e => setFile(e.target.files[0])} 
                    className="w-full p-4 pr-12 text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r from-blue-500 to-indigo-600 file:text-white hover:file:bg-gradient-to-r hover:file:from-blue-600 hover:file:to-indigo-700 transition-all duration-300 cursor-pointer"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                </div>
              </div>
              <button 
                onClick={upload} 
                disabled={loading || !file}
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-500 flex items-center ${loading || !file ? 'bg-gray-400 cursor-not-allowed opacity-70' : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-2xl hover:shadow-3xl transform hover:-translate-y-1'}`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-4 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing Resume...
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    Upload & Parse Resume
                  </>
                )}
              </button>
            </div>
            
            {error && (
              <div className="mt-8 p-5 bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 rounded-xl text-center animate-pulse">
                <div className="flex items-center justify-center">
                  <svg className="w-6 h-6 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="font-bold text-red-700">Error:</span>
                </div>
                <div className="text-red-600 mt-2">{error}</div>
              </div>
            )}

            {profile && (
              <div className="mt-10 animate-fade-in">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-8 pb-6 border-b border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                    <svg className="w-7 h-7 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Parsed Profile Information
                  </h3>
                  <div className="mt-3 sm:mt-0 flex items-center text-green-600 bg-green-50 px-4 py-2 rounded-full">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="font-bold">Successfully Parsed</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                  <Field label="Full Name" value={profile.full_name} autoFilled={!!profile.full_name} />
                  <Field label="Email" value={profile.email} autoFilled={!!profile.email} />
                  <Field label="Phone" value={profile.phone_number} autoFilled={!!profile.phone_number} />
                  <Field label="Areas of Interest" value={profile.areas_of_interest} textarea autoFilled={Array.isArray(profile.areas_of_interest) && profile.areas_of_interest.length > 0} />
                </div>
                <div className="mt-7">
                  <Field label="Skills" value={profile.skills} textarea autoFilled={Array.isArray(profile.skills) && profile.skills.length > 0} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mt-7">
                  <Field label="Education" value={profile.education} textarea autoFilled={Array.isArray(profile.education) && profile.education.length > 0} />
                  <Field label="Experience" value={profile.experience} textarea autoFilled={Array.isArray(profile.experience) && profile.experience.length > 0} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mt-7">
                  <Field label="Projects" value={profile.projects} textarea autoFilled={Array.isArray(profile.projects) && profile.projects.length > 0} />
                  <Field label="Certifications" value={profile.certifications} textarea autoFilled={Array.isArray(profile.certifications) && profile.certifications.length > 0} />
                </div>
                <div className="mt-7">
                  <Field label="Achievements" value={profile.achievements} textarea autoFilled={Array.isArray(profile.achievements) && profile.achievements.length > 0} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>Powered by AI • Secure • Fast • Accurate</p>
      </div>
    </div>
  );
}