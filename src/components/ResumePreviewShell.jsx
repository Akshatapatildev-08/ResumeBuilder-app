import './ResumePreviewShell.css';

function line(value, fallback) {
  const content = String(value || '').trim();
  return content || fallback;
}

export default function ResumePreviewShell({ resume }) {
  const { personal, summary, education, experience, projects, skills, links } = resume;

  return (
    <article className="resume-shell">
      <header className="resume-shell__header">
        <h2>{line(personal.name, 'Your Name')}</h2>
        <p>{[line(personal.email, 'email@domain.com'), line(personal.phone, '+91 xxxxx xxxxx'), line(personal.location, 'City, Country')].join(' | ')}</p>
      </header>

      <section className="resume-shell__section">
        <h3>Summary</h3>
        <p>{line(summary, 'Write a short summary that highlights your strengths and goals.')}</p>
      </section>

      <section className="resume-shell__section">
        <h3>Education</h3>
        {education.map((entry, index) => (
          <div key={`edu-${index}`} className="resume-shell__item">
            <strong>{line(entry.school, 'Institution')}</strong>
            <span>{line(entry.degree, 'Degree')}</span>
            <p>{line(entry.details, 'Education details')}</p>
          </div>
        ))}
      </section>

      <section className="resume-shell__section">
        <h3>Experience</h3>
        {experience.map((entry, index) => (
          <div key={`exp-${index}`} className="resume-shell__item">
            <strong>{line(entry.company, 'Company')}</strong>
            <span>{line(entry.role, 'Role')}</span>
            <p>{line(entry.details, 'Experience details')}</p>
          </div>
        ))}
      </section>

      <section className="resume-shell__section">
        <h3>Projects</h3>
        {projects.map((entry, index) => (
          <div key={`proj-${index}`} className="resume-shell__item">
            <strong>{line(entry.name, 'Project')}</strong>
            <p>{line(entry.details, 'Project details')}</p>
          </div>
        ))}
      </section>

      <section className="resume-shell__section">
        <h3>Skills</h3>
        <p>{line(skills, 'Skills list (comma-separated)')}</p>
      </section>

      <section className="resume-shell__section">
        <h3>Links</h3>
        <p>{`GitHub: ${line(links.github, 'github.com/yourprofile')}`}</p>
        <p>{`LinkedIn: ${line(links.linkedin, 'linkedin.com/in/yourprofile')}`}</p>
      </section>
    </article>
  );
}
