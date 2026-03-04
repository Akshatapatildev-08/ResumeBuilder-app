import { useMemo, useState } from 'react';
import ContextHeader from '../components/ContextHeader.jsx';
import ResumePreviewShell from '../components/ResumePreviewShell.jsx';
import TemplateTabs from '../components/TemplateTabs.jsx';
import './PreviewPage.css';

function hasText(value) {
  return String(value || '').trim().length > 0;
}

function toLines(value) {
  return String(value || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function allSkills(resume) {
  const technical = Array.isArray(resume.skills?.technical) ? resume.skills.technical : [];
  const soft = Array.isArray(resume.skills?.soft) ? resume.skills.soft : [];
  const tools = Array.isArray(resume.skills?.tools) ? resume.skills.tools : [];
  return [...technical, ...soft, ...tools].map((item) => String(item || '').trim()).filter(Boolean);
}

function buildPlainTextResume(resume) {
  const lines = [];
  const contact = [resume.personal.email, resume.personal.phone, resume.personal.location]
    .map((item) => String(item || '').trim())
    .filter(Boolean)
    .join(' | ');

  lines.push(resume.personal.name.trim() || 'Name');
  lines.push(`Contact: ${contact || 'N/A'}`);
  lines.push('');

  lines.push('Summary');
  lines.push(resume.summary.trim() || 'N/A');
  lines.push('');

  lines.push('Education');
  if (resume.education.some((entry) => hasText(entry.school) || hasText(entry.degree) || hasText(entry.details))) {
    resume.education.forEach((entry) => {
      if (!hasText(entry.school) && !hasText(entry.degree) && !hasText(entry.details)) return;
      lines.push(`- ${entry.school || 'Institution'} | ${entry.degree || 'Degree'}`);
      toLines(entry.details).forEach((item) => lines.push(`  ${item}`));
    });
  } else {
    lines.push('N/A');
  }
  lines.push('');

  lines.push('Experience');
  if (resume.experience.some((entry) => hasText(entry.company) || hasText(entry.role) || hasText(entry.details))) {
    resume.experience.forEach((entry) => {
      if (!hasText(entry.company) && !hasText(entry.role) && !hasText(entry.details)) return;
      lines.push(`- ${entry.company || 'Company'} | ${entry.role || 'Role'}`);
      toLines(entry.details).forEach((item) => lines.push(`  ${item}`));
    });
  } else {
    lines.push('N/A');
  }
  lines.push('');

  lines.push('Projects');
  if (resume.projects.some((entry) => hasText(entry.title) || hasText(entry.description))) {
    resume.projects.forEach((entry) => {
      if (!hasText(entry.title) && !hasText(entry.description)) return;
      lines.push(`- ${entry.title || 'Project'}`);
      toLines(entry.description).forEach((item) => lines.push(`  ${item}`));
      if (Array.isArray(entry.techStack) && entry.techStack.length > 0) {
        lines.push(`  Tech Stack: ${entry.techStack.join(', ')}`);
      }
      if (hasText(entry.liveUrl)) lines.push(`  Live: ${entry.liveUrl}`);
      if (hasText(entry.githubUrl)) lines.push(`  GitHub: ${entry.githubUrl}`);
    });
  } else {
    lines.push('N/A');
  }
  lines.push('');

  lines.push('Skills');
  lines.push(allSkills(resume).join(', ') || 'N/A');
  lines.push('');

  lines.push('Links');
  lines.push(`GitHub: ${resume.links.github.trim() || 'N/A'}`);
  lines.push(`LinkedIn: ${resume.links.linkedin.trim() || 'N/A'}`);

  return lines.join('\n');
}

function isResumePotentiallyIncomplete(resume) {
  const hasName = hasText(resume.personal.name);
  const hasProject = resume.projects.some((entry) => hasText(entry.title) || hasText(entry.description));
  const hasExperience = resume.experience.some((entry) => hasText(entry.company) || hasText(entry.role) || hasText(entry.details));
  return !hasName || (!hasProject && !hasExperience);
}

export default function PreviewPage({ resume, template, setTemplate }) {
  const [warning, setWarning] = useState('');
  const [copyState, setCopyState] = useState('idle');
  const plainText = useMemo(() => buildPlainTextResume(resume), [resume]);

  function applyExportWarningIfNeeded() {
    if (isResumePotentiallyIncomplete(resume)) {
      setWarning('Your resume may look incomplete.');
    } else {
      setWarning('');
    }
  }

  function handlePrint() {
    applyExportWarningIfNeeded();
    window.print();
  }

  async function handleCopyText() {
    applyExportWarningIfNeeded();
    try {
      await navigator.clipboard.writeText(plainText);
      setCopyState('copied');
      setTimeout(() => setCopyState('idle'), 1200);
    } catch {
      setCopyState('failed');
    }
  }

  return (
    <section className="preview-page">
      <ContextHeader
        title="Resume Preview"
        subtitle="Clean premium resume layout."
      />
      <div className="preview-page__actions">
        <button type="button" className="preview-page__action-btn" onClick={handlePrint}>
          Print / Save as PDF
        </button>
        <button type="button" className="preview-page__action-btn" onClick={handleCopyText}>
          {copyState === 'copied' ? 'Copied' : 'Copy Resume as Text'}
        </button>
      </div>
      {warning && <p className="preview-page__warning">{warning}</p>}
      <div className="preview-page__template-row">
        <TemplateTabs value={template} onChange={setTemplate} />
      </div>
      <div className="preview-page__canvas">
        <ResumePreviewShell resume={resume} template={template} />
      </div>
    </section>
  );
}
