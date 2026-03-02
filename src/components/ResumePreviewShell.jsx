import './ResumePreviewShell.css';

function hasText(value) {
  return String(value || '').trim().length > 0;
}

function text(value) {
  return String(value || '').trim();
}

export default function ResumePreviewShell({ resume }) {
  const { personal, summary, education, experience, projects, skills, links } = resume;
  const contactParts = [personal.email, personal.phone, personal.location].map(text).filter(Boolean);
  const showSummary = hasText(summary);
  const educationItems = education.filter((entry) => hasText(entry.school) || hasText(entry.degree) || hasText(entry.details));
  const experienceItems = experience.filter((entry) => hasText(entry.company) || hasText(entry.role) || hasText(entry.details));
  const projectItems = projects.filter((entry) => hasText(entry.name) || hasText(entry.details));
  const showSkills = hasText(skills);
  const showLinks = hasText(links.github) || hasText(links.linkedin);
  const showAnySection = showSummary || educationItems.length > 0 || experienceItems.length > 0 || projectItems.length > 0 || showSkills || showLinks;

  return (
    <article className="resume-shell">
      <header className="resume-shell__header">
        <h2>{text(personal.name) || 'Resume Preview'}</h2>
        {contactParts.length > 0 && <p>{contactParts.join(' | ')}</p>}
      </header>

      {showSummary && (
        <section className="resume-shell__section">
          <h3>Summary</h3>
          <p>{text(summary)}</p>
        </section>
      )}

      {educationItems.length > 0 && (
        <section className="resume-shell__section">
          <h3>Education</h3>
          {educationItems.map((entry, index) => (
            <div key={`edu-${index}`} className="resume-shell__item">
              {hasText(entry.school) && <strong>{text(entry.school)}</strong>}
              {hasText(entry.degree) && <span>{text(entry.degree)}</span>}
              {hasText(entry.details) && <p>{text(entry.details)}</p>}
            </div>
          ))}
        </section>
      )}

      {experienceItems.length > 0 && (
        <section className="resume-shell__section">
          <h3>Experience</h3>
          {experienceItems.map((entry, index) => (
            <div key={`exp-${index}`} className="resume-shell__item">
              {hasText(entry.company) && <strong>{text(entry.company)}</strong>}
              {hasText(entry.role) && <span>{text(entry.role)}</span>}
              {hasText(entry.details) && <p>{text(entry.details)}</p>}
            </div>
          ))}
        </section>
      )}

      {projectItems.length > 0 && (
        <section className="resume-shell__section">
          <h3>Projects</h3>
          {projectItems.map((entry, index) => (
            <div key={`proj-${index}`} className="resume-shell__item">
              {hasText(entry.name) && <strong>{text(entry.name)}</strong>}
              {hasText(entry.details) && <p>{text(entry.details)}</p>}
            </div>
          ))}
        </section>
      )}

      {showSkills && (
        <section className="resume-shell__section">
          <h3>Skills</h3>
          <p>{text(skills)}</p>
        </section>
      )}

      {showLinks && (
        <section className="resume-shell__section">
          <h3>Links</h3>
          {hasText(links.github) && <p>{`GitHub: ${text(links.github)}`}</p>}
          {hasText(links.linkedin) && <p>{`LinkedIn: ${text(links.linkedin)}`}</p>}
        </section>
      )}

      {!showAnySection && (
        <section className="resume-shell__empty">
          Start filling the form to generate your resume preview.
        </section>
      )}
    </article>
  );
}
