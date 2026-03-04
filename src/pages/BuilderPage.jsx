import { useMemo, useState } from 'react';
import ContextHeader from '../components/ContextHeader.jsx';
import ResumePreviewShell from '../components/ResumePreviewShell.jsx';
import TemplatePicker from '../components/TemplatePicker.jsx';
import { computeAtsScore } from '../lib/atsScore.js';
import { createSampleResume } from '../lib/resumeModel.js';
import './BuilderPage.css';

function createProjectId() {
  return `project-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function Section({ title, children }) {
  return (
    <section className="builder-page__section">
      <h3>{title}</h3>
      {children}
    </section>
  );
}

const ACTION_VERBS = [
  'Built',
  'Developed',
  'Designed',
  'Implemented',
  'Led',
  'Improved',
  'Created',
  'Optimized',
  'Automated',
];

const SUGGESTED_SKILLS = {
  technical: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'GraphQL'],
  soft: ['Team Leadership', 'Problem Solving'],
  tools: ['Git', 'Docker', 'AWS'],
};

function parseBullets(text) {
  return String(text || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function startsWithActionVerb(line) {
  const cleaned = line.replace(/^[-*•]\s*/, '');
  return ACTION_VERBS.some((verb) => new RegExp(`^${verb}\\b`, 'i').test(cleaned));
}

function hasNumber(line) {
  return /\d+(?:[.,]\d+)?\s*(?:%|x|X|k|K)?/.test(line);
}

function bulletGuidance(details) {
  return parseBullets(details).map((line, index) => {
    const messages = [];
    if (!startsWithActionVerb(line)) messages.push('Start with a strong action verb.');
    if (!hasNumber(line)) messages.push('Add measurable impact (numbers).');
    return { id: `${index}-${line}`, messages };
  });
}

function summaryWordCount(summary) {
  return String(summary || '').trim().split(/\s+/).filter(Boolean).length;
}

function countSkills(skills) {
  const technical = Array.isArray(skills?.technical) ? skills.technical : [];
  const soft = Array.isArray(skills?.soft) ? skills.soft : [];
  const tools = Array.isArray(skills?.tools) ? skills.tools : [];
  return [...technical, ...soft, ...tools].filter((item) => String(item || '').trim()).length;
}

function hasNumericImpactAnywhere(resume) {
  const lines = [
    ...resume.experience.flatMap((entry) => parseBullets(entry.details)),
    ...resume.projects.flatMap((entry) => parseBullets(entry.description)),
  ];
  return lines.some((line) => hasNumber(line));
}

function topImprovements(resume) {
  const list = [];
  const completeProjects = resume.projects.filter((entry) => entry.title.trim() && entry.description.trim()).length;
  const completeExperience = resume.experience.filter((entry) => entry.company.trim() && entry.role.trim() && entry.details.trim()).length;

  if (completeProjects < 2) list.push('Add at least 2 projects.');
  if (!hasNumericImpactAnywhere(resume)) list.push('Add measurable impact (numbers).');
  if (summaryWordCount(resume.summary) < 40) list.push('Expand summary to at least 40 words.');
  if (countSkills(resume.skills) < 8) list.push('Add more skills (target 8+).');
  if (completeExperience < 1) list.push('Add experience such as internship or project work.');

  return list.slice(0, 3);
}

function GuidanceList({ details }) {
  const rows = bulletGuidance(details).filter((row) => row.messages.length > 0);
  if (rows.length === 0) return null;

  return (
    <div className="builder-page__guidance">
      {rows.map((row) => (
        <p key={row.id} className="builder-page__guidance-line">
          {row.messages.join(' ')}
        </p>
      ))}
    </div>
  );
}

function SkillCategory({ label, categoryKey, skills, inputValue, onInputChange, onAddSkill, onRemoveSkill }) {
  function handleKeyDown(event) {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    onAddSkill(categoryKey, inputValue);
  }

  return (
    <div className="builder-page__skill-group">
      <p className="builder-page__skill-label">{`${label} (${skills.length})`}</p>
      <div className="builder-page__chips">
        {skills.map((skill) => (
          <span key={`${categoryKey}-${skill}`} className="builder-page__chip">
            {skill}
            <button type="button" onClick={() => onRemoveSkill(categoryKey, skill)} aria-label={`Remove ${skill}`}>
              x
            </button>
          </span>
        ))}
      </div>
      <input
        value={inputValue}
        onChange={(event) => onInputChange(categoryKey, event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type skill and press Enter"
      />
    </div>
  );
}

export default function BuilderPage({
  resume,
  setResume,
  template,
  setTemplate,
  accentColor,
  setAccentColor,
}) {
  const { score, suggestions } = computeAtsScore(resume);
  const improvements = topImprovements(resume);
  const [skillInputs, setSkillInputs] = useState({ technical: '', soft: '', tools: '' });
  const [projectTechInputs, setProjectTechInputs] = useState({});
  const [openProjects, setOpenProjects] = useState({});
  const [isSuggestingSkills, setIsSuggestingSkills] = useState(false);

  const skills = useMemo(
    () => ({
      technical: Array.isArray(resume.skills?.technical) ? resume.skills.technical : [],
      soft: Array.isArray(resume.skills?.soft) ? resume.skills.soft : [],
      tools: Array.isArray(resume.skills?.tools) ? resume.skills.tools : [],
    }),
    [resume.skills],
  );

  function updatePersonal(field, value) {
    setResume((prev) => ({
      ...prev,
      personal: { ...prev.personal, [field]: value },
    }));
  }

  function updateLinks(field, value) {
    setResume((prev) => ({
      ...prev,
      links: { ...prev.links, [field]: value },
    }));
  }

  function updateList(section, index, field, value) {
    setResume((prev) => {
      const next = [...prev[section]];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, [section]: next };
    });
  }

  function addListItem(section, templateItem) {
    setResume((prev) => ({
      ...prev,
      [section]: [...prev[section], templateItem],
    }));
  }

  function updateSkillInput(categoryKey, value) {
    setSkillInputs((prev) => ({ ...prev, [categoryKey]: value }));
  }

  function addSkill(categoryKey, value) {
    const nextValue = String(value || '').trim();
    if (!nextValue) return;

    setResume((prev) => {
      const existing = Array.isArray(prev.skills?.[categoryKey]) ? prev.skills[categoryKey] : [];
      const alreadyExists = existing.some((skill) => skill.toLowerCase() === nextValue.toLowerCase());
      if (alreadyExists) return prev;
      return {
        ...prev,
        skills: {
          ...prev.skills,
          [categoryKey]: [...existing, nextValue],
        },
      };
    });
    setSkillInputs((prev) => ({ ...prev, [categoryKey]: '' }));
  }

  function removeSkill(categoryKey, value) {
    setResume((prev) => {
      const existing = Array.isArray(prev.skills?.[categoryKey]) ? prev.skills[categoryKey] : [];
      return {
        ...prev,
        skills: {
          ...prev.skills,
          [categoryKey]: existing.filter((skill) => skill !== value),
        },
      };
    });
  }

  function handleSuggestSkills() {
    if (isSuggestingSkills) return;
    setIsSuggestingSkills(true);

    setTimeout(() => {
      setResume((prev) => {
        const merge = (currentList, additions) => {
          const map = new Map();
          [...currentList, ...additions].forEach((skill) => {
            const text = String(skill || '').trim();
            if (!text) return;
            const key = text.toLowerCase();
            if (!map.has(key)) map.set(key, text);
          });
          return [...map.values()];
        };

        return {
          ...prev,
          skills: {
            technical: merge(prev.skills.technical || [], SUGGESTED_SKILLS.technical),
            soft: merge(prev.skills.soft || [], SUGGESTED_SKILLS.soft),
            tools: merge(prev.skills.tools || [], SUGGESTED_SKILLS.tools),
          },
        };
      });
      setIsSuggestingSkills(false);
    }, 1000);
  }

  function updateProject(index, field, value) {
    setResume((prev) => {
      const next = [...prev.projects];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, projects: next };
    });
  }

  function toggleProject(projectId) {
    setOpenProjects((prev) => ({ ...prev, [projectId]: !prev[projectId] }));
  }

  function deleteProject(projectId) {
    setResume((prev) => ({
      ...prev,
      projects: prev.projects.filter((project) => project.id !== projectId),
    }));
    setProjectTechInputs((prev) => {
      const next = { ...prev };
      delete next[projectId];
      return next;
    });
  }

  function updateProjectTechInput(projectId, value) {
    setProjectTechInputs((prev) => ({ ...prev, [projectId]: value }));
  }

  function addProjectTech(projectId, value) {
    const nextValue = String(value || '').trim();
    if (!nextValue) return;

    setResume((prev) => {
      const next = prev.projects.map((project) => {
        if (project.id !== projectId) return project;
        const existing = Array.isArray(project.techStack) ? project.techStack : [];
        const already = existing.some((item) => item.toLowerCase() === nextValue.toLowerCase());
        if (already) return project;
        return { ...project, techStack: [...existing, nextValue] };
      });
      return { ...prev, projects: next };
    });

    setProjectTechInputs((prev) => ({ ...prev, [projectId]: '' }));
  }

  function removeProjectTech(projectId, value) {
    setResume((prev) => ({
      ...prev,
      projects: prev.projects.map((project) => {
        if (project.id !== projectId) return project;
        return { ...project, techStack: (project.techStack || []).filter((item) => item !== value) };
      }),
    }));
  }

  return (
    <section className="builder-page">
      <ContextHeader
        title="Resume Builder"
        subtitle="Auto-saved editing with deterministic ATS scoring v1."
      />

      <div className="builder-page__layout">
        <div className="builder-page__left">
          <div className="builder-page__toolbar">
            <button type="button" className="builder-page__sample-btn" onClick={() => setResume(createSampleResume())}>
              Load Sample Data
            </button>
          </div>

          <Section title="Personal Info">
            <input value={resume.personal.name} onChange={(e) => updatePersonal('name', e.target.value)} placeholder="Name" />
            <input value={resume.personal.email} onChange={(e) => updatePersonal('email', e.target.value)} placeholder="Email" />
            <input value={resume.personal.phone} onChange={(e) => updatePersonal('phone', e.target.value)} placeholder="Phone" />
            <input value={resume.personal.location} onChange={(e) => updatePersonal('location', e.target.value)} placeholder="Location" />
          </Section>

          <Section title="Summary">
            <textarea
              rows={4}
              value={resume.summary}
              onChange={(e) => setResume((prev) => ({ ...prev, summary: e.target.value }))}
              placeholder="Professional summary"
            />
          </Section>

          <Section title="Education">
            {resume.education.map((entry, index) => (
              <div key={`education-${index}`} className="builder-page__group">
                <input value={entry.school} onChange={(e) => updateList('education', index, 'school', e.target.value)} placeholder="Institution" />
                <input value={entry.degree} onChange={(e) => updateList('education', index, 'degree', e.target.value)} placeholder="Degree" />
                <textarea rows={3} value={entry.details} onChange={(e) => updateList('education', index, 'details', e.target.value)} placeholder="Details" />
              </div>
            ))}
            <button
              type="button"
              className="builder-page__add-btn"
              onClick={() => addListItem('education', { school: '', degree: '', details: '' })}
            >
              Add Education
            </button>
          </Section>

          <Section title="Experience">
            {resume.experience.map((entry, index) => (
              <div key={`experience-${index}`} className="builder-page__group">
                <input value={entry.company} onChange={(e) => updateList('experience', index, 'company', e.target.value)} placeholder="Company" />
                <input value={entry.role} onChange={(e) => updateList('experience', index, 'role', e.target.value)} placeholder="Role" />
                <textarea rows={3} value={entry.details} onChange={(e) => updateList('experience', index, 'details', e.target.value)} placeholder="Details" />
                <GuidanceList details={entry.details} />
              </div>
            ))}
            <button
              type="button"
              className="builder-page__add-btn"
              onClick={() => addListItem('experience', { company: '', role: '', details: '' })}
            >
              Add Experience
            </button>
          </Section>

          <Section title="Skills">
            <div className="builder-page__skills-toolbar">
              <button type="button" className="builder-page__suggest-btn" onClick={handleSuggestSkills} disabled={isSuggestingSkills}>
                {isSuggestingSkills ? 'Suggesting...' : '✨ Suggest Skills'}
              </button>
            </div>

            <SkillCategory
              label="Technical Skills"
              categoryKey="technical"
              skills={skills.technical}
              inputValue={skillInputs.technical}
              onInputChange={updateSkillInput}
              onAddSkill={addSkill}
              onRemoveSkill={removeSkill}
            />
            <SkillCategory
              label="Soft Skills"
              categoryKey="soft"
              skills={skills.soft}
              inputValue={skillInputs.soft}
              onInputChange={updateSkillInput}
              onAddSkill={addSkill}
              onRemoveSkill={removeSkill}
            />
            <SkillCategory
              label="Tools & Technologies"
              categoryKey="tools"
              skills={skills.tools}
              inputValue={skillInputs.tools}
              onInputChange={updateSkillInput}
              onAddSkill={addSkill}
              onRemoveSkill={removeSkill}
            />
          </Section>

          <Section title="Projects">
            <button
              type="button"
              className="builder-page__add-btn"
              onClick={() => addListItem('projects', { id: createProjectId(), title: '', description: '', techStack: [], liveUrl: '', githubUrl: '' })}
            >
              Add Project
            </button>

            {resume.projects.map((project, index) => {
              const headerTitle = project.title.trim() || `Untitled Project ${index + 1}`;
              const isOpen = openProjects[project.id] !== false;
              const techInput = projectTechInputs[project.id] || '';

              return (
                <article key={project.id} className="builder-page__project-card">
                  <header className="builder-page__project-head">
                    <button type="button" className="builder-page__project-toggle" onClick={() => toggleProject(project.id)}>
                      {headerTitle}
                    </button>
                    <button type="button" className="builder-page__delete-btn" onClick={() => deleteProject(project.id)}>
                      Delete
                    </button>
                  </header>

                  {isOpen && (
                    <div className="builder-page__project-body">
                      <input
                        value={project.title}
                        onChange={(e) => updateProject(index, 'title', e.target.value)}
                        placeholder="Project Title"
                      />
                      <textarea
                        rows={4}
                        maxLength={200}
                        value={project.description}
                        onChange={(e) => updateProject(index, 'description', e.target.value)}
                        placeholder="Description (max 200 chars)"
                      />
                      <p className="builder-page__counter">{`${project.description.length}/200`}</p>

                      <div className="builder-page__chips">
                        {(project.techStack || []).map((tech) => (
                          <span key={`${project.id}-${tech}`} className="builder-page__chip">
                            {tech}
                            <button type="button" onClick={() => removeProjectTech(project.id, tech)} aria-label={`Remove ${tech}`}>
                              x
                            </button>
                          </span>
                        ))}
                      </div>
                      <input
                        value={techInput}
                        onChange={(event) => updateProjectTechInput(project.id, event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key !== 'Enter') return;
                          event.preventDefault();
                          addProjectTech(project.id, techInput);
                        }}
                        placeholder="Tech Stack: type and press Enter"
                      />

                      <input
                        value={project.liveUrl}
                        onChange={(e) => updateProject(index, 'liveUrl', e.target.value)}
                        placeholder="Live URL (optional)"
                      />
                      <input
                        value={project.githubUrl}
                        onChange={(e) => updateProject(index, 'githubUrl', e.target.value)}
                        placeholder="GitHub URL (optional)"
                      />

                      <GuidanceList details={project.description} />
                    </div>
                  )}
                </article>
              );
            })}
          </Section>

          <Section title="Links">
            <input value={resume.links.github} onChange={(e) => updateLinks('github', e.target.value)} placeholder="GitHub" />
            <input value={resume.links.linkedin} onChange={(e) => updateLinks('linkedin', e.target.value)} placeholder="LinkedIn" />
          </Section>
        </div>

        <div className="builder-page__right">
          <div className="builder-page__score-card">
            <p className="builder-page__score-label">ATS Readiness Score</p>
            <div className="builder-page__score-row">
              <div className="builder-page__meter" aria-hidden="true">
                <div className="builder-page__meter-fill" style={{ width: `${score}%` }} />
              </div>
              <strong>{score}/100</strong>
            </div>

            {suggestions.length > 0 && (
              <ul className="builder-page__suggestions">
                {suggestions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}

            <div className="builder-page__improvements">
              <p className="builder-page__improvements-title">Top 3 Improvements</p>
              {improvements.length > 0 ? (
                <ul className="builder-page__suggestions">
                  {improvements.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="builder-page__improvements-empty">Current draft covers top baseline checks.</p>
              )}
            </div>
          </div>

          <h3>Live Preview</h3>
          <TemplatePicker
            template={template}
            onTemplateChange={setTemplate}
            colorValue={accentColor}
            onColorChange={setAccentColor}
          />
          <ResumePreviewShell resume={resume} template={template} accentColor={accentColor} />
        </div>
      </div>
    </section>
  );
}
