import React, { useState, useRef } from 'react';
import Navbar from '../../../components/Navbar.jsx';
import { generateInterviewReport } from '../services/interview.api.js';
import {
  UploadCloud,
  FileText,
  Briefcase,
  User,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Printer,
  ChevronDown,
  ChevronUp,
  Target,
  Code2,
  Calendar,
  HelpCircle,
  Copy,
  Check,
  Layers,
  Sparkles,
  BookOpen
} from 'lucide-react';

const SAMPLE_JOBS = [
  {
    title: 'Full Stack MERN',
    desc: `Position: Senior Full Stack Engineer (Node.js & React)\nExperience: 3-5 years\nRequirements:\n- Strong production experience with Node.js, Express, and MongoDB\n- Modern React (Hooks, Context, state management, performance profiling)\n- RESTful API design, JWT auth, RBAC authorization, and input validation\n- Familiarity with Redis caching, Docker containerization, and message queues (RabbitMQ/Kafka)\n- Strong understanding of database indexing, query optimization, and async concurrency`
  },
  {
    title: 'Frontend React',
    desc: `Position: Frontend Engineer (React & TypeScript)\nExperience: 2-4 years\nRequirements:\n- Deep understanding of modern React internals, virtual DOM, and rendering lifecycles\n- Advanced TypeScript, reusable design systems, and responsive web accessibility\n- State management, component lazy-loading, and frontend performance budgeting\n- Unit & integration testing with Vitest/Jest and React Testing Library`
  },
  {
    title: 'Backend Node.js',
    desc: `Position: Backend Systems Engineer (Node.js & Databases)\nExperience: 3+ years\nRequirements:\n- Mastery of Node.js event loop, streams, worker threads, and asynchronous design\n- Relational and NoSQL modeling (PostgreSQL / MongoDB), ACID transactions, and indexing\n- Distributed caching strategies with Redis, rate limiting, and API security\n- Microservices architecture, container orchestration, and CI/CD pipelines`
  }
];

const SAMPLE_INTRO = `I am a full-stack engineer with 3 years of hands-on experience building production web applications with Node.js, Express, React, and MongoDB. I specialize in designing scalable REST APIs, optimizing slow database queries using indexing, and implementing secure token-based authentication. I enjoy working on distributed system trade-offs and performance optimization.`;

const Home = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [selfDescription, setSelfDescription] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [report, setReport] = useState(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState('technical');
  const [expandedTech, setExpandedTech] = useState({ 0: true, 1: true });
  const [expandedBeh, setExpandedBeh] = useState({ 0: true });
  const [completedTasks, setCompletedTasks] = useState({});
  const [techCategoryFilter, setTechCategoryFilter] = useState('all');
  const [copiedIndex, setCopiedIndex] = useState(null);

  const fileInputRef = useRef(null);

  // Drag & Drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        setResumeFile(file);
        setError('');
      } else {
        setError('Please upload a PDF document for your resume.');
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        setResumeFile(file);
        setError('');
      } else {
        setError('Only PDF files are supported.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!resumeFile) {
      setError('Please attach your resume in PDF format to begin analysis.');
      return;
    }

    if (!jobDescription.trim()) {
      setError('Please provide the target job description to evaluate.');
      return;
    }

    setLoading(true);
    try {
      const data = await generateInterviewReport({
        resumeFile,
        selfDescription,
        jobDescription
      });

      if (data && data.interviewReport) {
        setReport(data.interviewReport);
        setActiveTab('technical');
        setTimeout(() => {
          document.getElementById('report-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        setError('Unable to parse interview assessment. Please retry.');
      }
    } catch (err) {
      console.error('Error generating report:', err);
      setError(err.response?.data?.message || err.message || 'Error processing request with backend service.');
    } finally {
      setLoading(false);
    }
  };

  const toggleTech = (idx) => {
    setExpandedTech((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleBeh = (idx) => {
    setExpandedBeh((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleTask = (taskId) => {
    setCompletedTasks((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  const handleReset = () => {
    setReport(null);
    setResumeFile(null);
    setJobDescription('');
    setSelfDescription('');
    setError('');
  };

  const techCount = report?.technicalQuestions?.length || 0;
  const behCount = report?.behavioralQuestions?.length || 0;
  const gapCount = report?.skillGaps?.length || 0;
  const planDays = report?.preperationPlan?.length || 0;

  return (
    <div className="home-page-container">
      <Navbar />

      <main className="content-wrapper">
        {/* Professional Header Section */}
        <section className="hero-header">
          <div className="hero-pill-row">
            <span className="badge badge-cyan">
              <Code2 size={12} /> Technical Interview Readiness
            </span>
            <span className="badge badge-neutral">Resume & JD Evaluation</span>
          </div>

          <h1 className="hero-heading">
            Technical Interview Preparation & Gap Analysis
          </h1>
          <p className="hero-description">
            Upload your technical resume alongside the target job specifications to uncover critical skill gaps, 
            evaluate profile alignment, and practice deep scenario-based architectural and behavioral questions with thorough model answers.
          </p>

          <div className="capabilities-bar">
            <div className="capability-item">
              <span className="cap-dot dot-cyan"></span>
              <span>10–15 Personalized Technical Qs</span>
            </div>
            <div className="capability-item">
              <span className="cap-dot dot-green"></span>
              <span>Project + Skill + JD Coverage</span>
            </div>
            <div className="capability-item">
              <span className="cap-dot dot-amber"></span>
              <span>STAR Behavioral Framework</span>
            </div>
            <div className="capability-item">
              <span className="cap-dot dot-purple"></span>
              <span>Skill Gap & Study Sprint</span>
            </div>
          </div>
        </section>

        {/* Input Configuration Studio */}
        <form onSubmit={handleSubmit} className="studio-workspace">
          {/* Left Column: Job Description */}
          <div className="surface-card studio-panel">
            <div className="panel-header">
              <div className="panel-title-group">
                <Briefcase size={16} className="panel-icon" />
                <h2 className="panel-title">Target Job Description</h2>
              </div>
              <span className="char-badge">{jobDescription.length} chars</span>
            </div>

            <p className="panel-sub">
              Paste the requirements, qualifications, and tech stack from the hiring post.
            </p>

            {/* Quick Templates */}
            <div className="template-pills-row">
              <span className="template-label">Sample Templates:</span>
              {SAMPLE_JOBS.map((job, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setJobDescription(job.desc)}
                  className="template-chip"
                >
                  {job.title}
                </button>
              ))}
            </div>

            <div className="form-group mt-2">
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="e.g. Seeking a Senior Backend Engineer proficient in Node.js, distributed database modeling, Redis caching, and microservices architecture..."
                rows={10}
                required
              />
            </div>
          </div>

          {/* Right Column: Resume & Profile */}
          <div className="surface-card studio-panel">
            <div className="panel-header">
              <div className="panel-title-group">
                <FileText size={16} className="panel-icon" />
                <h2 className="panel-title">Candidate Resume & Background</h2>
              </div>
              <span className="badge badge-neutral">PDF Format</span>
            </div>

            <p className="panel-sub">
              Upload your engineering resume to extract technical competencies and project history.
            </p>

            {/* File Dropzone */}
            <div
              className={`file-dropzone ${isDragging ? 'drag-active' : ''} ${resumeFile ? 'file-attached' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />

              {resumeFile ? (
                <div className="attached-file-row">
                  <div className="file-avatar">
                    <FileText size={20} color="var(--accent-cyan)" />
                  </div>
                  <div className="file-meta">
                    <span className="file-title">{resumeFile.name}</span>
                    <span className="file-details">{(resumeFile.size / 1024).toFixed(1)} KB • PDF Document</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setResumeFile(null);
                    }}
                    className="btn btn-secondary btn-sm replace-file-btn"
                  >
                    Replace
                  </button>
                </div>
              ) : (
                <div className="empty-dropzone-content">
                  <div className="upload-circle">
                    <UploadCloud size={24} color="var(--accent-cyan)" />
                  </div>
                  <p className="upload-prompt">
                    <strong>Click to upload</strong> or drag & drop resume PDF
                  </p>
                  <span className="upload-limit">PDF files up to 10MB</span>
                </div>
              )}
            </div>

            {/* Self Description */}
            <div className="form-group mt-3">
              <div className="label-action-row">
                <label htmlFor="selfDescription">
                  <User size={15} /> Candidate Summary & Focus Areas (Optional)
                </label>
                <button
                  type="button"
                  onClick={() => setSelfDescription(SAMPLE_INTRO)}
                  className="quick-fill-link"
                >
                  Load Sample Intro
                </button>
              </div>
              <textarea
                id="selfDescription"
                value={selfDescription}
                onChange={(e) => setSelfDescription(e.target.value)}
                placeholder="Briefly highlight your core specialization, years of experience, and architectural areas you want evaluated..."
                rows={4}
              />
            </div>
          </div>
        </form>

        {/* Error Notice */}
        {error && (
          <div className="alert-banner">
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Primary Action Button */}
        <div className="action-button-wrapper">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn btn-primary btn-lg main-analyze-btn"
          >
            {loading ? (
              <span className="loading-state-text">
                <span className="pulse-ring"></span> Analyzing Profile & Generating Interview Brief...
              </span>
            ) : (
              <>
                <span>Analyze Profile & Generate Interview Brief</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>

        {/* Comprehensive Report Presentation */}
        {report && (
          <section id="report-section" className="assessment-results-container">
            {/* Executive Summary Card */}
            <div className="surface-card executive-summary-card">
              <div className="summary-left">
                <div className="summary-status-pill">
                  <span className="status-indicator"></span> Assessment Completed
                </div>
                <h2 className="summary-heading">Evaluation Brief & Technical Roadmap</h2>
                <p className="summary-sub">
                  Detailed analysis based on parsed resume qualifications against the target requirements.
                </p>

                {/* Highlights row */}
                <div className="metrics-chip-row">
                  <span className="metric-chip">
                    <strong>{techCount}</strong> Technical Questions
                  </span>
                  <span className="metric-chip">
                    <strong>{behCount}</strong> Behavioral Scenarios
                  </span>
                  <span className="metric-chip">
                    <strong>{gapCount}</strong> Skill Gaps
                  </span>
                  <span className="metric-chip">
                    <strong>{planDays}</strong> Day Sprint
                  </span>
                </div>
              </div>

              {/* Match Score Display */}
              <div className="match-score-panel">
                <span className="match-label">PROFILE ALIGNMENT</span>
                <div className="score-flex-row">
                  <span className="score-value">{report.matchScore ?? 82}</span>
                  <span className="score-symbol">%</span>
                </div>
                <span className={`badge ${
                  (report.matchScore ?? 82) >= 75 ? 'badge-green' : 'badge-amber'
                }`}>
                  {(report.matchScore ?? 82) >= 75 ? 'Strong Match' : 'Partial Match'}
                </span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="tabs-navigation-bar">
              <button
                type="button"
                onClick={() => setActiveTab('technical')}
                className={`tab-btn ${activeTab === 'technical' ? 'tab-btn-active' : ''}`}
              >
                <Code2 size={16} /> Technical Questions ({techCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('behavioral')}
                className={`tab-btn ${activeTab === 'behavioral' ? 'tab-btn-active' : ''}`}
              >
                <HelpCircle size={16} /> Behavioral Scenarios ({behCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('gaps')}
                className={`tab-btn ${activeTab === 'gaps' ? 'tab-btn-active' : ''}`}
              >
                <Target size={16} /> Skill Gaps ({gapCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('plan')}
                className={`tab-btn ${activeTab === 'plan' ? 'tab-btn-active' : ''}`}
              >
                <Calendar size={16} /> Study Roadmap ({planDays} Days)
              </button>
            </div>

            {/* Tab 1: Technical Questions (Detailed In-Depth View) */}
            {activeTab === 'technical' && (
              <div className="tab-content-pane">
                <div className="section-meta-header">
                  <h3 className="section-title">Personalized Technical Questions</h3>
                  <p className="section-caption">
                    Questions generated from your actual projects, listed skills, and job description requirements — tailored specifically to your profile.
                  </p>
                </div>

                {/* Category Filter Bar */}
                <div className="category-filter-bar">
                  {[
                    { key: 'all', label: 'All Questions', color: 'filter-all' },
                    { key: 'project', label: '🏗 Project-Based', color: 'filter-project' },
                    { key: 'skill', label: '⚡ Skill-Based', color: 'filter-skill' },
                    { key: 'job-description', label: '📋 Job Description', color: 'filter-jd' }
                  ].map(f => (
                    <button
                      key={f.key}
                      type="button"
                      onClick={() => setTechCategoryFilter(f.key)}
                      className={`category-filter-chip ${f.color} ${techCategoryFilter === f.key ? 'filter-active' : ''}`}
                    >
                      {f.label}
                      <span className="filter-count">
                        {f.key === 'all'
                          ? report.technicalQuestions?.length
                          : report.technicalQuestions?.filter(q => q.category === f.key).length}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="questions-accordion-list">
                  {report.technicalQuestions && report.technicalQuestions.length > 0 ? (
                    report.technicalQuestions
                      .filter(q => techCategoryFilter === 'all' || q.category === techCategoryFilter)
                      .map((q, idx) => {
                        const originalIdx = report.technicalQuestions.indexOf(q);
                        const isOpen = expandedTech[originalIdx];
                        const categoryConfig = {
                          'project': { label: 'Project-Based', cls: 'cat-badge-project' },
                          'skill': { label: 'Skill-Based', cls: 'cat-badge-skill' },
                          'job-description': { label: 'Job Description', cls: 'cat-badge-jd' }
                        };
                        const cat = categoryConfig[q.category] || { label: 'Technical', cls: 'cat-badge-project' };
                        return (
                          <div key={originalIdx} className={`surface-card question-card ${isOpen ? 'card-open' : ''}`}>
                            <div className="question-header-row" onClick={() => toggleTech(originalIdx)}>
                              <div className="question-number-badge">
                                Q{originalIdx + 1}
                              </div>
                              <div className="question-text-wrapper">
                                <div className="question-meta-row">
                                  <span className={`cat-badge ${cat.cls}`}>{cat.label}</span>
                                </div>
                                <h4 className="question-title-text">{q.question}</h4>
                              </div>
                              <div className="expand-indicator">
                                {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                              </div>
                            </div>

                            {isOpen && (
                              <div className="question-expanded-content">
                                {/* Interviewer Objective Callout */}
                                <div className="objective-callout">
                                  <span className="callout-label">
                                    <Target size={14} /> Evaluation Objective:
                                  </span>
                                  <p className="callout-body">{q.intention}</p>
                                </div>

                                {/* In-Depth Answer Block */}
                                <div className="model-answer-block">
                                  <div className="answer-block-header">
                                    <span className="answer-label">
                                      <BookOpen size={14} /> Comprehensive Model Answer:
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => copyToClipboard(q.answer, `t-${originalIdx}`)}
                                      className="copy-answer-btn"
                                    >
                                      {copiedIndex === `t-${originalIdx}` ? (
                                        <>
                                          <Check size={13} color="var(--accent-green)" />
                                          <span>Copied</span>
                                        </>
                                      ) : (
                                        <>
                                          <Copy size={13} />
                                          <span>Copy Answer</span>
                                        </>
                                      )}
                                    </button>
                                  </div>
                                  <div className="answer-paragraphs">
                                    {q.answer.split('\n').map((paragraph, pIdx) => {
                                      if (!paragraph.trim()) return null;
                                      return <p key={pIdx}>{paragraph}</p>;
                                    })}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })
                  ) : (
                    <div className="surface-card empty-card">No technical questions available.</div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 2: Behavioral Scenarios (STAR Method) */}
            {activeTab === 'behavioral' && (
              <div className="tab-content-pane">
                <div className="section-meta-header">
                  <h3 className="section-title">Behavioral & Leadership Scenarios (STAR Method)</h3>
                  <p className="section-caption">
                    Structured situational questions evaluating team communication, conflict management, cross-functional collaboration, and ownership.
                  </p>
                </div>

                <div className="questions-accordion-list">
                  {report.behavioralQuestions && report.behavioralQuestions.length > 0 ? (
                    report.behavioralQuestions.map((q, idx) => {
                      const isOpen = expandedBeh[idx];
                      return (
                        <div key={idx} className={`surface-card question-card ${isOpen ? 'card-open' : ''}`}>
                          <div className="question-header-row" onClick={() => toggleBeh(idx)}>
                            <div className="question-number-badge badge-beh">
                              B{idx + 1}
                            </div>
                            <div className="question-text-wrapper">
                              <h4 className="question-title-text">{q.question}</h4>
                            </div>
                            <div className="expand-indicator">
                              {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </div>
                          </div>

                          {isOpen && (
                            <div className="question-expanded-content">
                              {/* Interviewer Objective Callout */}
                              <div className="objective-callout">
                                <span className="callout-label">
                                  <HelpCircle size={14} /> Evaluation Focus:
                                </span>
                                <p className="callout-body">{q.intention}</p>
                              </div>

                              {/* Model Answer (STAR) */}
                              <div className="model-answer-block">
                                <div className="answer-block-header">
                                  <span className="answer-label">
                                    <BookOpen size={14} /> Structured STAR Response:
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => copyToClipboard(q.answer, `b-${idx}`)}
                                    className="copy-answer-btn"
                                  >
                                    {copiedIndex === `b-${idx}` ? (
                                      <>
                                        <Check size={13} color="var(--accent-green)" />
                                        <span>Copied</span>
                                      </>
                                    ) : (
                                      <>
                                        <Copy size={13} />
                                        <span>Copy Answer</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                                <div className="answer-paragraphs">
                                  {q.answer.split('\n').map((paragraph, pIdx) => {
                                    if (!paragraph.trim()) return null;
                                    return <p key={pIdx}>{paragraph}</p>;
                                  })}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="surface-card empty-card">No behavioral questions available.</div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 3: Skill Gaps */}
            {activeTab === 'gaps' && (
              <div className="tab-content-pane">
                <div className="section-meta-header">
                  <h3 className="section-title">Identified Skill Gaps & Technical Deficits</h3>
                  <p className="section-caption">
                    Areas highlighted in the job description where your resume showed limited direct evidence. Prioritize these for preparation.
                  </p>
                </div>

                <div className="skill-gaps-grid">
                  {report.skillGaps && report.skillGaps.length > 0 ? (
                    report.skillGaps.map((item, idx) => (
                      <div key={idx} className="surface-card skill-card">
                        <div className="skill-card-top">
                          <span className="skill-title">{item.skill}</span>
                          <span
                            className={`badge ${
                              item.severity === 'high'
                                ? 'badge-pink'
                                : item.severity === 'medium'
                                ? 'badge-amber'
                                : 'badge-green'
                            }`}
                          >
                            {item.severity.toUpperCase()} PRIORITY
                          </span>
                        </div>
                        <p className="skill-advice">
                          {item.severity === 'high'
                            ? 'Core requirement for this role. Prepare system-level architecture examples and gotchas.'
                            : item.severity === 'medium'
                            ? 'Frequently evaluated in secondary rounds. Review fundamentals and API concepts.'
                            : 'Good to know. Familiarize yourself with basic terminology and practical use cases.'}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="surface-card empty-card">
                      <CheckCircle2 size={18} color="var(--accent-green)" />
                      <span>No major technical gaps detected against this job description.</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 4: Day-by-Day Study Plan */}
            {activeTab === 'plan' && (
              <div className="tab-content-pane">
                <div className="section-meta-header">
                  <h3 className="section-title">Targeted Study Sprint Roadmap</h3>
                  <p className="section-caption">
                    A concrete multi-day schedule designed to bridge your identified skill gaps before your interview.
                  </p>
                </div>

                <div className="sprint-days-container">
                  {report.preperationPlan && report.preperationPlan.length > 0 ? (
                    report.preperationPlan.map((dayItem, dIdx) => (
                      <div key={dIdx} className="surface-card day-plan-card">
                        <div className="day-card-header">
                          <div className="day-badge">DAY {dayItem.day}</div>
                          <h4 className="day-focus-heading">{dayItem.focus}</h4>
                        </div>

                        <div className="tasks-checkbox-list">
                          {dayItem.tasks &&
                            dayItem.tasks.map((task, tIdx) => {
                              const key = `${dIdx}-${tIdx}`;
                              const isDone = completedTasks[key];
                              return (
                                <label
                                  key={tIdx}
                                  className={`task-item ${isDone ? 'task-checked' : ''}`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={!!isDone}
                                    onChange={() => toggleTask(key)}
                                    className="task-input-checkbox"
                                  />
                                  <span className="task-label-text">{task}</span>
                                </label>
                              );
                            })}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="surface-card empty-card">No preparation plan available.</div>
                  )}
                </div>
              </div>
            )}

            {/* Bottom Actions Bar */}
            <div className="report-footer-actions">
              <button onClick={() => window.print()} className="btn btn-secondary btn-sm">
                <Printer size={15} /> Print / Export PDF
              </button>
              <button onClick={handleReset} className="btn btn-primary btn-sm">
                <RotateCcw size={15} /> Start New Assessment
              </button>
            </div>
          </section>
        )}
      </main>

      <style>{`
        .home-page-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .content-wrapper {
          flex: 1;
          max-width: 1240px;
          margin: 0 auto;
          width: 100%;
          padding: 2.75rem 1.5rem 5rem;
        }

        /* Hero Header */
        .hero-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .hero-pill-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .hero-heading {
          font-size: clamp(1.85rem, 4vw, 2.75rem);
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 0.85rem;
          color: var(--text-primary);
        }

        .hero-description {
          max-width: 760px;
          margin: 0 auto 1.5rem;
          font-size: 1.02rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .capabilities-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          flex-wrap: wrap;
          padding: 0.65rem 1.25rem;
          background-color: rgba(23, 27, 40, 0.6);
          border: var(--border-subtle);
          border-radius: var(--radius-pill);
          display: inline-flex;
          font-size: 0.82rem;
          font-weight: 500;
          color: var(--text-secondary);
        }

        .capability-item {
          display: flex;
          align-items: center;
          gap: 0.45rem;
        }

        .cap-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .dot-cyan { background-color: var(--accent-cyan); }
        .dot-green { background-color: var(--accent-green); }
        .dot-amber { background-color: var(--accent-amber); }
        .dot-purple { background-color: var(--accent-purple); }

        /* Studio Workspace */
        .studio-workspace {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.75rem;
          margin-bottom: 2rem;
        }

        @media (min-width: 900px) {
          .studio-workspace {
            grid-template-columns: 1fr 1fr;
          }
        }

        .studio-panel {
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
        }

        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .panel-title-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .panel-icon {
          color: var(--accent-cyan);
        }

        .panel-title {
          font-size: 1.2rem;
          font-weight: 700;
        }

        .char-badge {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-dim);
        }

        .panel-sub {
          font-size: 0.88rem;
          color: var(--text-secondary);
          margin-bottom: 1rem;
        }

        .template-pills-row {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          flex-wrap: wrap;
          margin-bottom: 0.75rem;
        }

        .template-label {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--text-dim);
        }

        .template-chip {
          background-color: var(--bg-surface-elevated);
          border: var(--border-subtle);
          color: var(--text-secondary);
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-xs);
          font-size: 0.78rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .template-chip:hover {
          background-color: var(--bg-surface-hover);
          color: var(--text-primary);
          border-color: var(--accent-cyan-border);
        }

        /* Dropzone */
        .file-dropzone {
          border: 1.5px dashed var(--border-medium);
          border-radius: var(--radius-sm);
          background-color: var(--bg-input);
          padding: 1.75rem 1rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.15s ease;
          user-select: none;
        }

        .file-dropzone:hover, .file-dropzone.drag-active {
          border-color: var(--accent-cyan);
          background-color: rgba(0, 240, 255, 0.02);
        }

        .file-dropzone.file-attached {
          border-style: solid;
          border-color: var(--accent-cyan-border);
          background-color: rgba(0, 240, 255, 0.03);
          padding: 1rem 1.25rem;
        }

        .empty-dropzone-content {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .upload-circle {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background-color: var(--bg-surface-elevated);
          border: var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.75rem;
        }

        .upload-prompt {
          font-size: 0.9rem;
          color: var(--text-primary);
          margin-bottom: 0.2rem;
        }

        .upload-limit {
          font-size: 0.78rem;
          color: var(--text-dim);
        }

        .attached-file-row {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          text-align: left;
        }

        .file-avatar {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-xs);
          background-color: var(--accent-cyan-dim);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .file-meta {
          flex: 1;
        }

        .file-title {
          display: block;
          font-size: 0.92rem;
          font-weight: 600;
          color: var(--text-primary);
          word-break: break-all;
        }

        .file-details {
          font-size: 0.78rem;
          color: var(--text-secondary);
        }

        .label-action-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .quick-fill-link {
          background: none;
          border: none;
          color: var(--accent-cyan);
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
        }

        .quick-fill-link:hover {
          text-decoration: underline;
        }

        .mt-2 { margin-top: 0.5rem; }
        .mt-3 { margin-top: 1rem; }

        /* Error */
        .alert-banner {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background-color: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.25);
          color: #F87171;
          padding: 0.85rem 1.25rem;
          border-radius: var(--radius-sm);
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
        }

        /* Action */
        .action-button-wrapper {
          display: flex;
          justify-content: center;
          margin-bottom: 3.5rem;
        }

        .main-analyze-btn {
          width: 100%;
          max-width: 500px;
        }

        .loading-state-text {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        .pulse-ring {
          width: 14px;
          height: 14px;
          border: 2px solid #000000;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Results Container */
        .assessment-results-container {
          margin-top: 2rem;
        }

        .executive-summary-card {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
          border-color: var(--border-medium);
        }

        @media (min-width: 768px) {
          .executive-summary-card {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }

        .summary-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--accent-green);
          margin-bottom: 0.5rem;
        }

        .status-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--accent-green);
          box-shadow: 0 0 8px rgba(16, 185, 129, 0.6);
        }

        .summary-heading {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 0.35rem;
        }

        .summary-sub {
          color: var(--text-secondary);
          font-size: 0.95rem;
          margin-bottom: 1.25rem;
        }

        .metrics-chip-row {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          flex-wrap: wrap;
        }

        .metric-chip {
          padding: 0.3rem 0.75rem;
          background-color: var(--bg-surface-elevated);
          border: var(--border-subtle);
          border-radius: var(--radius-xs);
          font-size: 0.82rem;
          color: var(--text-secondary);

          strong {
            color: var(--text-primary);
          }
        }

        .match-score-panel {
          min-width: 180px;
          padding: 1.25rem 1.75rem;
          background-color: var(--bg-surface-elevated);
          border: 1px solid var(--accent-cyan-border);
          border-radius: var(--radius-md);
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          box-shadow: var(--shadow-glow-cyan);
        }

        .match-label {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: var(--text-muted);
        }

        .score-flex-row {
          display: flex;
          align-items: baseline;
          line-height: 1;
          margin: 0.4rem 0 0.6rem;
        }

        .score-value {
          font-size: 3rem;
          font-weight: 800;
          color: var(--accent-cyan);
        }

        .score-symbol {
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--accent-cyan);
        }

        /* Tabs Navigation */
        .tabs-navigation-bar {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border-bottom: var(--border-subtle);
          margin-bottom: 1.75rem;
          overflow-x: auto;
          padding-bottom: 0.25rem;
        }

        .tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.2rem;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-secondary);
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s ease;
        }

        .tab-btn:hover {
          color: var(--text-primary);
        }

        .tab-btn-active {
          color: var(--accent-cyan);
          border-bottom-color: var(--accent-cyan);
        }

        /* Section Meta */
        .section-meta-header {
          margin-bottom: 1.5rem;
        }

        .section-title {
          font-size: 1.35rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .section-caption {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        /* Accordion Cards */
        .questions-accordion-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .question-card {
          overflow: hidden;
          padding: 0;
        }

        .card-open {
          border-color: var(--border-medium);
        }

        .question-header-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem 1.5rem;
          cursor: pointer;
          background-color: var(--bg-surface);
          transition: background-color 0.15s ease;
        }

        .question-header-row:hover {
          background-color: var(--bg-surface-elevated);
        }

        .question-number-badge {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-xs);
          background-color: var(--accent-cyan-dim);
          color: var(--accent-cyan);
          border: 1px solid var(--accent-cyan-border);
          font-size: 0.8rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .badge-beh {
          background-color: var(--accent-purple-dim);
          color: var(--accent-purple);
          border-color: rgba(139, 92, 246, 0.3);
        }

        .question-text-wrapper {
          flex: 1;
        }

        .question-title-text {
          font-size: 1.05rem;
          font-weight: 600;
          line-height: 1.45;
          color: var(--text-primary);
        }

        /* Category Filter Bar */
        .category-filter-bar {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 1.5rem;
        }

        .category-filter-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.45rem 0.9rem;
          border-radius: var(--radius-xs);
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
          border: 1px solid transparent;
          background-color: var(--bg-surface-elevated);
          color: var(--text-secondary);
        }

        .category-filter-chip:hover {
          color: var(--text-primary);
          border-color: var(--border-medium);
        }

        .filter-count {
          padding: 0.1rem 0.4rem;
          border-radius: 999px;
          font-size: 0.72rem;
          background-color: rgba(255,255,255,0.08);
          color: var(--text-muted);
        }

        .filter-all.filter-active {
          background-color: rgba(248, 250, 252, 0.1);
          border-color: rgba(248, 250, 252, 0.3);
          color: var(--text-primary);
        }

        .filter-project.filter-active {
          background-color: rgba(0, 240, 255, 0.1);
          border-color: var(--accent-cyan-border);
          color: var(--accent-cyan);
        }

        .filter-project.filter-active .filter-count {
          background-color: rgba(0, 240, 255, 0.15);
          color: var(--accent-cyan);
        }

        .filter-skill.filter-active {
          background-color: rgba(139, 92, 246, 0.12);
          border-color: rgba(139, 92, 246, 0.4);
          color: var(--accent-purple);
        }

        .filter-skill.filter-active .filter-count {
          background-color: rgba(139, 92, 246, 0.15);
          color: var(--accent-purple);
        }

        .filter-jd.filter-active {
          background-color: rgba(245, 158, 11, 0.12);
          border-color: rgba(245, 158, 11, 0.4);
          color: var(--accent-amber);
        }

        .filter-jd.filter-active .filter-count {
          background-color: rgba(245, 158, 11, 0.15);
          color: var(--accent-amber);
        }

        /* Question Category Badges */
        .question-meta-row {
          margin-bottom: 0.35rem;
        }

        .cat-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.15rem 0.55rem;
          border-radius: var(--radius-xs);
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.03em;
          text-transform: uppercase;
        }

        .cat-badge-project {
          background-color: rgba(0, 240, 255, 0.1);
          color: var(--accent-cyan);
          border: 1px solid var(--accent-cyan-border);
        }

        .cat-badge-skill {
          background-color: rgba(139, 92, 246, 0.12);
          color: var(--accent-purple);
          border: 1px solid rgba(139, 92, 246, 0.35);
        }

        .cat-badge-jd {
          background-color: rgba(245, 158, 11, 0.12);
          color: var(--accent-amber);
          border: 1px solid rgba(245, 158, 11, 0.35);
        }

        .expand-indicator {
          color: var(--text-muted);
          flex-shrink: 0;
        }

        .question-expanded-content {
          border-top: var(--border-subtle);
          padding: 1.5rem;
          background-color: #0E1017;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .objective-callout {
          background-color: rgba(0, 240, 255, 0.04);
          border-left: 3px solid var(--accent-cyan);
          border-radius: 0 var(--radius-xs) var(--radius-xs) 0;
          padding: 0.85rem 1.15rem;
        }

        .callout-label {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--accent-cyan);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 0.25rem;
        }

        .callout-body {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .model-answer-block {
          background-color: var(--bg-surface);
          border: var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 1.25rem 1.5rem;
        }

        .answer-block-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 0.75rem;
          margin-bottom: 0.85rem;
          border-bottom: var(--border-subtle);
        }

        .answer-label {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .copy-answer-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 0.78rem;
          cursor: pointer;
          transition: color 0.15s ease;
        }

        .copy-answer-btn:hover {
          color: var(--text-primary);
        }

        .answer-paragraphs {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;

          p {
            font-size: 0.95rem;
            color: var(--text-primary);
            line-height: 1.65;
          }
        }

        /* Skill Gaps Grid */
        .skill-gaps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.15rem;
        }

        .skill-card {
          padding: 1.25rem;
        }

        .skill-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          margin-bottom: 0.65rem;
        }

        .skill-title {
          font-weight: 700;
          font-size: 1.05rem;
          color: var(--text-primary);
        }

        .skill-advice {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        /* Sprint Plan */
        .sprint-days-container {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .day-plan-card {
          padding: 1.5rem;
        }

        .day-card-header {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          margin-bottom: 1.15rem;
        }

        .day-badge {
          padding: 0.25rem 0.65rem;
          background-color: var(--accent-cyan-dim);
          border: 1px solid var(--accent-cyan-border);
          color: var(--accent-cyan);
          border-radius: var(--radius-xs);
          font-size: 0.75rem;
          font-weight: 700;
        }

        .day-focus-heading {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .tasks-checkbox-list {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .task-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          background-color: var(--bg-surface-elevated);
          border: var(--border-subtle);
          border-radius: var(--radius-xs);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .task-item:hover {
          border-color: var(--border-medium);
        }

        .task-checked {
          background-color: rgba(18, 21, 31, 0.4);
          text-decoration: line-through;
          opacity: 0.6;
        }

        .task-input-checkbox {
          width: 16px;
          height: 16px;
          accent-color: var(--accent-cyan);
          cursor: pointer;
        }

        .task-label-text {
          font-size: 0.9rem;
          color: var(--text-primary);
        }

        .empty-card {
          padding: 2rem;
          text-align: center;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .report-footer-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.75rem;
          margin-top: 2rem;
        }

        @media (max-width: 640px) {
          .content-wrapper {
            padding: 1.75rem 1rem 3.5rem;
          }

          .capabilities-bar {
            display: none;
          }

          .panel-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.25rem;
          }

          .char-badge {
            align-self: flex-end;
          }

          .report-footer-actions {
            flex-direction: column;
            button {
              width: 100%;
            }
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
