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
    <div className="mb-5">
      <div className="flex justify-between items-center mb-1">
        <label className="font-semibold text-gray-700 text-sm uppercase tracking-wide">{label}</label>
        <span className={`text-xs px-3 py-1 rounded-full font-medium ${filled ? (autoFilled ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800") : "bg-yellow-100 text-yellow-800"}`}>
          {filled ? (autoFilled ? "Auto-filled" : "Filled") : "Needs review"}
        </span>
      </div>
      {textarea ? (
        <textarea 
          readOnly 
          value={displayValue} 
          rows={4} 
          className={`w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${!filled ? "bg-yellow-50 border-yellow-200" : "bg-white border-gray-300"}`} 
        />
      ) : (
        <input 
          readOnly 
          value={displayValue} 
          className={`w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${!filled ? "bg-yellow-50 border-yellow-200" : "bg-white border-gray-300"}`} 
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
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-3">Upload Your Resume</h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">Upload your resume in PDF or DOCX format to auto-fill your profile</p>
      </div>
      
      <div className="flex flex-col items-center mb-8">
        <div className="w-full max-w-md mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Resume File</label>
          <input 
            type="file" 
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={e => setFile(e.target.files[0])} 
            className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
          />
        </div>
        <button 
          onClick={upload} 
          disabled={loading || !file}
          className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center ${loading || !file ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'}`}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : 'Upload & Parse Resume'}
        </button>
      </div>
      
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-center">
          <div className="font-medium">Error:</div>
          <div>{error}</div>
        </div>
      )}

      {profile && (
        <div className="mt-8 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Parsed Profile Information</h3>
            <div className="flex items-center text-green-600">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span className="font-medium">Successfully Parsed</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Full Name" value={profile.full_name} autoFilled={!!profile.full_name} />
            <Field label="Email" value={profile.email} autoFilled={!!profile.email} />
            <Field label="Phone" value={profile.phone_number} autoFilled={!!profile.phone_number} />
            <Field label="Areas of Interest" value={profile.areas_of_interest} textarea autoFilled={Array.isArray(profile.areas_of_interest) && profile.areas_of_interest.length > 0} />
          </div>
          <div className="mt-6">
            <Field label="Skills" value={profile.skills} textarea autoFilled={Array.isArray(profile.skills) && profile.skills.length > 0} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Field label="Education" value={profile.education} textarea autoFilled={Array.isArray(profile.education) && profile.education.length > 0} />
            <Field label="Experience" value={profile.experience} textarea autoFilled={Array.isArray(profile.experience) && profile.experience.length > 0} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Field label="Projects" value={profile.projects} textarea autoFilled={Array.isArray(profile.projects) && profile.projects.length > 0} />
            <Field label="Certifications" value={profile.certifications} textarea autoFilled={Array.isArray(profile.certifications) && profile.certifications.length > 0} />
          </div>
          <div className="mt-6">
            <Field label="Achievements" value={profile.achievements} textarea autoFilled={Array.isArray(profile.achievements) && profile.achievements.length > 0} />
          </div>
        </div>
      )}
    </div>
  );
}