import './ResumePreviewShell.css';

function hasText(value) {
  return String(value || '').trim().length > 0;
}

function text(value) {
  return String(value || '').trim();
}

function renderProjectLinks(entry) {
  if (!hasText(entry.liveUrl) && !hasText(entry.githubUrl)) return null;
  return (
    <div className="resume-shell__project-links">
      {hasText(entry.liveUrl) && (
        <a href={entry.liveUrl} target="_blank" rel="noreferrer" className="resume-shell__link-icon" aria-label="Live URL">
          🔗
        </a>
      )}
      {hasText(entry.githubUrl) && (
        <a href={entry.githubUrl} target="_blank" rel="noreferrer" className="resume-shell__link-icon" aria-label="GitHub URL">
          💻
        </a>
      )}
    </div>
  );
}

export default function ResumePreviewShell({ resume, template = 'classic', accentColor = 'hsl(168, 60%, 40%)' }) {
  const { personal, summary, education, experience, projects, skills, links } = resume;
  const contactParts = [personal.email, personal.phone, personal.location].map(text).filter(Boolean);
  const showSummary = hasText(summary);
  const educationItems = education.filter((entry) => hasText(entry.school) || hasText(entry.degree) || hasText(entry.details));
  const experienceItems = experience.filter((entry) => hasText(entry.company) || hasText(entry.role) || hasText(entry.details));
  const projectItems = projects.filter(
    (entry) => hasText(entry.title) || hasText(entry.description) || (Array.isArray(entry.techStack) && entry.techStack.length > 0) || hasText(entry.liveUrl) || hasText(entry.githubUrl),
  );
  const skillGroups = [
    { label: 'Technical Skills', items: Array.isArray(skills?.technical) ? skills.technical.filter(hasText) : [] },
    { label: 'Soft Skills', items: Array.isArray(skills?.soft) ? skills.soft.filter(hasText) : [] },
    { label: 'Tools & Technologies', items: Array.isArray(skills?.tools) ? skills.tools.filter(hasText) : [] },
  ].filter((group) => group.items.length > 0);
  const showSkills = skillGroups.length > 0;
  const showLinks = hasText(links.github) || hasText(links.linkedin);
  const showAnySection = showSummary
    || educationItems.length > 0
    || experienceItems.length > 0
    || projectItems.length > 0
    || showSkills
    || showLinks;

  if (template === 'modern') {
    return (
      <article className="resume-shell resume-shell--modern" style={{ '--accent-color': accentColor }}>
        <aside className="resume-shell__sidebar">
          <h2>{text(personal.name) || 'Resume Preview'}</h2>
          {contactParts.length > 0 && <p>{contactParts.join(' | ')}</p>}

          {showSkills && (
            <section className="resume-shell__side-section">
              <h3>Skills</h3>
              {skillGroups.map((group) => (
                <div key={group.label} className="resume-shell__skill-group">
                  <p className="resume-shell__skill-label">{group.label}</p>
                  <div className="resume-shell__pills">
                    {group.items.map((item) => (
                      <span key={`${group.label}-${item}`} className="resume-shell__pill">{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          )}

          {showLinks && (
            <section className="resume-shell__side-section">
              <h3>Links</h3>
              {hasText(links.github) && <p>{`GitHub: ${text(links.github)}`}</p>}
              {hasText(links.linkedin) && <p>{`LinkedIn: ${text(links.linkedin)}`}</p>}
            </section>
          )}
        </aside>

        <div className="resume-shell__main">
          {showSummary && (
            <section className="resume-shell__section">
              <h3>Summary</h3>
              <p>{text(summary)}</p>
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
              <div className="resume-shell__project-grid">
                {projectItems.map((entry) => (
                  <article key={entry.id || `${entry.title}-${entry.description}`} className="resume-shell__project-card">
                    {hasText(entry.title) && <strong>{text(entry.title)}</strong>}
                    {hasText(entry.description) && <p>{text(entry.description)}</p>}
                    {Array.isArray(entry.techStack) && entry.techStack.length > 0 && (
                      <div className="resume-shell__pills">
                        {entry.techStack.filter(hasText).map((tech) => (
                          <span key={`${entry.id}-${tech}`} className="resume-shell__pill">{tech}</span>
                        ))}
                      </div>
                    )}
                    {renderProjectLinks(entry)}
                  </article>
                ))}
              </div>
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

          {!showAnySection && (
            <section className="resume-shell__empty">
              Start filling the form to generate your resume preview.
            </section>
          )}
        </div>
      </article>
    );
  }

  return (
    <article className={`resume-shell resume-shell--${template}`} style={{ '--accent-color': accentColor }}>
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
          <div className="resume-shell__project-grid">
            {projectItems.map((entry) => (
              <article key={entry.id || `${entry.title}-${entry.description}`} className="resume-shell__project-card">
                {hasText(entry.title) && <strong>{text(entry.title)}</strong>}
                {hasText(entry.description) && <p>{text(entry.description)}</p>}
                {Array.isArray(entry.techStack) && entry.techStack.length > 0 && (
                  <div className="resume-shell__pills">
                    {entry.techStack.filter(hasText).map((tech) => (
                      <span key={`${entry.id}-${tech}`} className="resume-shell__pill">{tech}</span>
                    ))}
                  </div>
                )}
                {renderProjectLinks(entry)}
              </article>
            ))}
          </div>
        </section>
      )}

      {showSkills && (
        <section className="resume-shell__section">
          <h3>Skills</h3>
          {skillGroups.map((group) => (
            <div key={group.label} className="resume-shell__skill-group">
              <p className="resume-shell__skill-label">{group.label}</p>
              <div className="resume-shell__pills">
                {group.items.map((item) => (
                  <span key={`${group.label}-${item}`} className="resume-shell__pill">{item}</span>
                ))}
              </div>
            </div>
          ))}
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
