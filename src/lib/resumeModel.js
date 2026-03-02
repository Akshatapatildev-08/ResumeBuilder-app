export const RESUME_STORAGE_KEY = 'resumeBuilderData';

export function createEmptyResume() {
  return {
    personal: {
      name: '',
      email: '',
      phone: '',
      location: '',
    },
    summary: '',
    education: [
      { school: '', degree: '', details: '' },
    ],
    experience: [
      { company: '', role: '', details: '' },
    ],
    projects: [
      { name: '', details: '' },
    ],
    skills: '',
    links: {
      github: '',
      linkedin: '',
    },
  };
}

function normalizeText(value) {
  return String(value || '');
}

function normalizeList(raw, template) {
  if (!Array.isArray(raw) || raw.length === 0) return [template];
  return raw.map((item) => ({
    ...template,
    ...(item && typeof item === 'object' ? item : {}),
  }));
}

export function normalizeResume(raw) {
  const base = createEmptyResume();
  if (!raw || typeof raw !== 'object') return base;

  return {
    personal: {
      name: normalizeText(raw.personal?.name),
      email: normalizeText(raw.personal?.email),
      phone: normalizeText(raw.personal?.phone),
      location: normalizeText(raw.personal?.location),
    },
    summary: normalizeText(raw.summary),
    education: normalizeList(raw.education, { school: '', degree: '', details: '' }).map((entry) => ({
      school: normalizeText(entry.school),
      degree: normalizeText(entry.degree),
      details: normalizeText(entry.details),
    })),
    experience: normalizeList(raw.experience, { company: '', role: '', details: '' }).map((entry) => ({
      company: normalizeText(entry.company),
      role: normalizeText(entry.role),
      details: normalizeText(entry.details),
    })),
    projects: normalizeList(raw.projects, { name: '', details: '' }).map((entry) => ({
      name: normalizeText(entry.name),
      details: normalizeText(entry.details),
    })),
    skills: normalizeText(raw.skills),
    links: {
      github: normalizeText(raw.links?.github),
      linkedin: normalizeText(raw.links?.linkedin),
    },
  };
}

export function createSampleResume() {
  return {
    personal: {
      name: 'Aarav Sharma',
      email: 'aarav.sharma@email.com',
      phone: '+91 98765 43210',
      location: 'Bengaluru, India',
    },
    summary: 'Frontend-focused software engineer building clean, performant web experiences with React and modern JavaScript.',
    education: [
      {
        school: 'ABC Institute of Technology',
        degree: 'B.E. Computer Science',
        details: '2020-2024 | CGPA 8.7/10',
      },
      {
        school: 'State Junior College',
        degree: 'Higher Secondary',
        details: '2018-2020 | PCM',
      },
    ],
    experience: [
      {
        company: 'CodeCraft Labs',
        role: 'Frontend Intern',
        details: 'Built dashboard features in React and improved page load performance by optimizing component rendering.',
      },
      {
        company: 'Freelance',
        role: 'Web Developer',
        details: 'Delivered portfolio and landing-page projects for local businesses with responsive layouts.',
      },
    ],
    projects: [
      {
        name: 'Placement Tracker',
        details: 'A student job-tracking platform with role filters, progress boards, and reminders.',
      },
      {
        name: 'Interview Prep Hub',
        details: 'A structured practice app for coding rounds with milestone-based tracking.',
      },
    ],
    skills: 'React, JavaScript, HTML, CSS, Node.js, Git, REST APIs',
    links: {
      github: 'github.com/aaravdev',
      linkedin: 'linkedin.com/in/aaravsharma',
    },
  };
}
