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
