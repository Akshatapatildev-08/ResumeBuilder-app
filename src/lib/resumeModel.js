export const RESUME_STORAGE_KEY = 'resumeBuilderData';

function createProjectId() {
  return `project-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function parseLegacySkillsToTechnical(skills) {
  return String(skills || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

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
      { id: createProjectId(), title: '', description: '', techStack: [], liveUrl: '', githubUrl: '' },
    ],
    skills: {
      technical: [],
      soft: [],
      tools: [],
    },
    links: {
      github: '',
      linkedin: '',
    },
  };
}

function normalizeText(value) {
  return String(value || '');
}

function normalizeTags(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => String(item || '').trim())
    .filter(Boolean);
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
    projects: normalizeList(raw.projects, { id: '', title: '', description: '', techStack: [], liveUrl: '', githubUrl: '' }).map((entry) => {
      const legacyTitle = normalizeText(entry.title || entry.name);
      const legacyDescription = normalizeText(entry.description || entry.details);
      return {
        id: normalizeText(entry.id) || createProjectId(),
        title: legacyTitle,
        description: legacyDescription,
        techStack: normalizeTags(entry.techStack),
        liveUrl: normalizeText(entry.liveUrl),
        githubUrl: normalizeText(entry.githubUrl),
      };
    }),
    skills: {
      technical: normalizeTags(raw.skills?.technical || parseLegacySkillsToTechnical(raw.skills)),
      soft: normalizeTags(raw.skills?.soft),
      tools: normalizeTags(raw.skills?.tools),
    },
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
        id: createProjectId(),
        title: 'Placement Tracker',
        description: 'Built a student job-tracking platform with role filters, progress boards, and reminders.',
        techStack: ['React', 'Node.js', 'PostgreSQL'],
        liveUrl: 'https://placement-tracker.example.com',
        githubUrl: 'https://github.com/aaravdev/placement-tracker',
      },
      {
        id: createProjectId(),
        title: 'Interview Prep Hub',
        description: 'Developed a structured practice app for coding rounds with milestone-based tracking.',
        techStack: ['TypeScript', 'React', 'GraphQL'],
        liveUrl: '',
        githubUrl: 'https://github.com/aaravdev/interview-prep-hub',
      },
    ],
    skills: {
      technical: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'GraphQL'],
      soft: ['Team Leadership', 'Problem Solving'],
      tools: ['Git', 'Docker', 'AWS'],
    },
    links: {
      github: 'github.com/aaravdev',
      linkedin: 'linkedin.com/in/aaravsharma',
    },
  };
}
