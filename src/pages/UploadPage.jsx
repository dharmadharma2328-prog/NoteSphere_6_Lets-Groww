import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { categories } from '../data/mockData';
import { 
  UploadCloud, FileText, CheckCircle, AlertCircle, X, 
  Sparkles, Globe, ShieldCheck, Youtube 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UploadPage = () => {
  const { addNote, addToast } = useApp();
  const navigate = useNavigate();

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [semester, setSemester] = useState('');
  const [branch, setBranch] = useState('');
  const [degree, setDegree] = useState('');
  const [resourceType, setResourceType] = useState('PDFs');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  
  // File upload simulation states
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle | uploading | completed
  const [error, setError] = useState('');

  // AI assistant simulation fields filling
  const [aiAnalyzing, setAiAnalyzing] = useState(false);

  // Auto-tag suggestions
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState(['Exam Prep']);
  const [suggestedTags, setSuggestedTags] = useState([]);

  // Auto-suggest tags based on input
  useEffect(() => {
    if (!tagInput) {
      setSuggestedTags([]);
      return;
    }
    const tagsBank = ["Data Structures", "Algorithms", "React", "DBMS", "Operating Systems", "Python", "Physics", "Chemistry", "Mathematics", "Cheat Sheet", "Lab Manual", "Placements"];
    const filtered = tagsBank.filter(t => 
      t.toLowerCase().includes(tagInput.toLowerCase()) && !tags.includes(t)
    );
    setSuggestedTags(filtered);
  }, [tagInput]);

  // AI details filler simulation
  const triggerAiAnalysis = () => {
    if (!title.trim()) {
      addToast('Please enter a Title first to let AI analyze.', 'warning');
      return;
    }

    setAiAnalyzing(true);
    addToast('NoteSphere AI is analyzing title keywords...', 'info');

    setTimeout(() => {
      setAiAnalyzing(false);
      const titleLower = title.toLowerCase();

      if (titleLower.includes('data') || titleLower.includes('dsa') || titleLower.includes('algorithm')) {
        setSubject('Data Structures');
        setBranch('Computer Science');
        setDegree('BTech');
        setSemester('Semester 3');
        setTags(prev => [...new Set([...prev, 'DSA', 'Algorithms', 'Placements'])]);
      } else if (titleLower.includes('operating') || titleLower.includes('os')) {
        setSubject('Operating Systems');
        setBranch('Computer Science');
        setDegree('BTech');
        setSemester('Semester 4');
        setTags(prev => [...new Set([...prev, 'OS', 'Scheduling'])]);
      } else if (titleLower.includes('chemistry')) {
        setSubject('Chemistry');
        setBranch('Chemistry');
        setDegree('BSc');
        setSemester('Semester 1');
        setTags(prev => [...new Set([...prev, 'Chemistry', 'Reactions'])]);
      } else {
        setSubject('Mathematics');
        setBranch('Computer Science');
        setDegree('BTech');
        setSemester('Semester 1');
      }

      addToast('AI Smart Suggestions applied!', 'success');
    }, 1500);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setSelectedFile(files[0]);
      addToast(`Selected file: ${files[0].name}`, 'info');
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      setSelectedFile(files[0]);
      addToast(`Selected file: ${files[0].name}`, 'info');
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setUploadStatus('idle');
  };

  const handleAddTag = (tag) => {
    const activeTag = tag || tagInput;
    if (activeTag && !tags.includes(activeTag)) {
      setTags([...tags, activeTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!selectedFile) {
      setError('Please drag & drop or select a study resource file.');
      return;
    }
    if (!title.trim() || !description.trim() || !subject || !semester || !branch || !degree) {
      setError('Please fill in all details for resource indexing.');
      return;
    }

    setUploadStatus('uploading');
    setUploadProgress(10);

    // Simulate gradual upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          setUploadStatus('completed');
          
          // Add to App Context DB
          addNote({
            title,
            description,
            subject,
            semester,
            branch,
            degree,
            resourceType,
            fileSize: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
            youtubeUrl: youtubeUrl || null
          });

          return 100;
        }
        return prev + 20;
      });
    }, 300);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Title Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold font-heading dark:text-white">Upload Study Material</h1>
        <p className="text-xs text-slate-400 mt-1">Publish notes, cheat sheets, or question papers to share with other students.</p>
      </div>

      {/* Main Upload Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Upload Zone & Progression */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleFormSubmit} className="glass-panel p-5 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 space-y-6">
            
            {/* Validation alert */}
            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-3.5 text-xs font-semibold">
                <AlertCircle className="h-4.5 w-4.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Drag & Drop Zone */}
            {uploadStatus === 'idle' ? (
              <div 
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-sky-500/50 rounded-2xl p-8 text-center transition-colors cursor-pointer bg-slate-50/50 dark:bg-slate-950/20"
              >
                <input 
                  type="file" 
                  id="file-input" 
                  className="hidden" 
                  onChange={handleFileSelect}
                  accept=".pdf,.ppt,.pptx,.doc,.docx,.txt"
                />
                <label htmlFor="file-input" className="cursor-pointer">
                  <UploadCloud className="h-10 w-10 text-slate-400 mx-auto mb-4 hover:text-sky-500 transition-colors" />
                  <p className="text-sm font-bold dark:text-white">Drag & drop your study file here</p>
                  <p className="text-xs text-slate-400 mt-1">Supported formats: PDF, PPT, Word, TXT (Max 50MB)</p>
                  <span className="inline-block mt-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-350 hover:bg-slate-50">
                    Select File
                  </span>
                </label>
              </div>
            ) : (
              /* Uploading & Completed Panel */
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-6 bg-slate-50/50 dark:bg-slate-950/20">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center shrink-0">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold dark:text-white truncate">{selectedFile.name}</p>
                    <p className="text-[11px] text-slate-400">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                  {uploadStatus !== 'uploading' && (
                    <button 
                      type="button" 
                      onClick={handleRemoveFile}
                      className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/5 transition-all"
                    >
                      <X className="h-4.5 w-4.5" />
                    </button>
                  )}
                </div>

                {/* Progress bar */}
                <div className="mt-6">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mb-1.5">
                    <span>{uploadStatus === 'completed' ? 'Upload Completed' : 'Uploading to NoteSphere...'}</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 dark:bg-slate-850 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>

                {uploadStatus === 'completed' && (
                  <div className="flex items-center gap-2 text-emerald-500 text-xs font-bold mt-4">
                    <CheckCircle className="h-4 w-4" />
                    <span>Resource successfully cataloged. Click "Save Notes" to publish.</span>
                  </div>
                )}
              </div>
            )}

            {/* Title & Description Fields */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Document Title</label>
                  <button 
                    type="button"
                    onClick={triggerAiAnalysis}
                    disabled={aiAnalyzing}
                    className="flex items-center gap-1.5 text-xs font-bold text-indigo-500 hover:text-indigo-600 focus:outline-none"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{aiAnalyzing ? 'Analyzing...' : 'AI Autofill'}</span>
                  </button>
                </div>
                <input 
                  type="text" 
                  placeholder="e.g. Data Structures - BST, Trees, and Graphs Notes"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:border-sky-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Document Description</label>
                <textarea 
                  placeholder="Describe what is covered in this resource (chapters, topics, formulas)..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="3"
                  className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:border-sky-500 outline-none"
                />
              </div>
            </div>

            {/* Categorization options selection dropdowns */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Degree</label>
                <select
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs outline-none"
                >
                  <option value="">Select Degree</option>
                  {categories.degrees.map((deg, i) => (
                    <option key={i} value={deg}>{deg}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Discipline / Branch</label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs outline-none"
                >
                  <option value="">Select Branch</option>
                  {categories.branches.map((br, i) => (
                    <option key={i} value={br}>{br}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Semester</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs outline-none"
                >
                  <option value="">Select Semester</option>
                  {categories.semesters.map((sem, i) => (
                    <option key={i} value={sem}>{sem}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs outline-none"
                >
                  <option value="">Select Subject</option>
                  {categories.subjects.map((sub, i) => (
                    <option key={i} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Format and optional YT Link */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Resource Format</label>
                <select
                  value={resourceType}
                  onChange={(e) => setResourceType(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs outline-none"
                >
                  {categories.resourceTypes.map((res, i) => (
                    <option key={i} value={res.value}>{res.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">YouTube URL (Optional)</label>
                <div className="relative">
                  <Youtube className="absolute left-3 top-3 h-4 w-4 text-slate-450" />
                  <input 
                    type="url" 
                    placeholder="Link video to these notes..."
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs outline-none focus:border-sky-500"
                  />
                </div>
              </div>
            </div>

            {/* Tags and suggestions */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Resource Tags</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((t, i) => (
                  <span 
                    key={i} 
                    className="inline-flex items-center gap-1 text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 px-2.5 py-1 rounded-lg"
                  >
                    <span>{t}</span>
                    <button type="button" onClick={() => handleRemoveTag(t)} className="text-slate-450 hover:text-red-500 font-bold">×</button>
                  </span>
                ))}
              </div>
              
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Add custom tag (e.g. EndSem)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="flex-1 h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs outline-none"
                />
                <button 
                  type="button"
                  onClick={() => handleAddTag()}
                  className="h-9 px-4 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300"
                >
                  Add
                </button>
              </div>

              {/* Tag suggestions list */}
              {suggestedTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  <span className="text-[10px] font-bold text-slate-400 self-center mr-1">Suggestions:</span>
                  {suggestedTags.slice(0, 4).map((tag, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleAddTag(tag)}
                      className="text-[9px] font-bold bg-sky-500/5 text-sky-500 hover:bg-sky-500/10 border border-sky-500/10 rounded px-2 py-0.5"
                    >
                      +{tag}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={uploadStatus === 'uploading'}
              className="w-full py-3 rounded-xl premium-gradient text-white font-bold text-sm hover:scale-[1.01] transition-transform flex items-center justify-center gap-2"
            >
              <UploadCloud className="h-4.5 w-4.5" />
              <span>Publish to NoteSphere</span>
            </button>

          </form>
        </div>

        {/* Right Side Info Widgets */}
        <div className="space-y-6">
          
          {/* AI recommendations widget */}
          <div className="glass-panel p-5 rounded-3xl border border-slate-200/50 dark:border-slate-800/50">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-indigo-500" />
              <h3 className="font-heading font-bold text-sm dark:text-white">NoteSphere Indexing AI</h3>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Our AI automatically inspects your document titles to categorize them correctly. Use the Autofill suggestion tool to quickly tag subjects, degrees, and branches.
            </p>
          </div>

          {/* Upload Guidelines */}
          <div className="glass-panel p-5 rounded-3xl border border-slate-200/50 dark:border-slate-800/50">
            <h3 className="font-heading font-bold text-sm dark:text-white mb-4">Upload Guidelines</h3>
            <ul className="space-y-3 text-[11px] leading-relaxed text-slate-400 list-disc pl-4">
              <li>Ensure you have the right to share the file (no copyrighted books without permission).</li>
              <li>Handwritten notes should be scanned clearly under proper lighting.</li>
              <li>Include descriptive titles for searchable index optimization.</li>
              <li>Assign correct Semester and Subjects to reach the right study circles.</li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
};

export default UploadPage;
