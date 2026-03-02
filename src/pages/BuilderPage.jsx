import ContextHeader from '../components/ContextHeader.jsx';
import ResumePreviewShell from '../components/ResumePreviewShell.jsx';
import { createSampleResume } from '../lib/resumeModel.js';
import './BuilderPage.css';

function Section({ title, children }) {
  return (
    <section className="builder-page__section">
      <h3>{title}</h3>
      {children}
    </section>
  );
}

export default function BuilderPage({ resume, setResume }) {
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

  function addListItem(section, template) {
    setResume((prev) => ({
      ...prev,
      [section]: [...prev[section], template],
    }));
  }

  return (
    <section className="builder-page">
      <ContextHeader
        title="Resume Builder"
        subtitle="Structure and live preview shell only. No scoring, export, or validation."
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

          <Section title="Projects">
            {resume.projects.map((entry, index) => (
              <div key={`projects-${index}`} className="builder-page__group">
                <input value={entry.name} onChange={(e) => updateList('projects', index, 'name', e.target.value)} placeholder="Project name" />
                <textarea rows={3} value={entry.details} onChange={(e) => updateList('projects', index, 'details', e.target.value)} placeholder="Details" />
              </div>
            ))}
            <button
              type="button"
              className="builder-page__add-btn"
              onClick={() => addListItem('projects', { name: '', details: '' })}
            >
              Add Project
            </button>
          </Section>

          <Section title="Skills">
            <input
              value={resume.skills}
              onChange={(e) => setResume((prev) => ({ ...prev, skills: e.target.value }))}
              placeholder="Comma-separated skills"
            />
          </Section>

          <Section title="Links">
            <input value={resume.links.github} onChange={(e) => updateLinks('github', e.target.value)} placeholder="GitHub" />
            <input value={resume.links.linkedin} onChange={(e) => updateLinks('linkedin', e.target.value)} placeholder="LinkedIn" />
          </Section>
        </div>

        <div className="builder-page__right">
          <h3>Live Preview</h3>
          <ResumePreviewShell resume={resume} />
        </div>
      </div>
    </section>
  );
}
