function hasText(value) {
  return String(value || '').trim().length > 0;
}

function parseSkills(skills) {
  if (skills && typeof skills === 'object' && !Array.isArray(skills)) {
    return [
      ...(Array.isArray(skills.technical) ? skills.technical : []),
      ...(Array.isArray(skills.soft) ? skills.soft : []),
      ...(Array.isArray(skills.tools) ? skills.tools : []),
    ]
      .map((item) => String(item || '').trim())
      .filter(Boolean);
  }

  return String(skills || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function hasActionVerbInSummary(summary) {
  const verbs = ['built', 'led', 'designed', 'improved', 'developed', 'implemented', 'optimized', 'created', 'automated'];
  const content = String(summary || '').toLowerCase();
  return verbs.some((verb) => new RegExp(`\\b${verb}\\b`, 'i').test(content));
}

function hasExperienceWithBullets(experience) {
  if (!Array.isArray(experience)) return false;
  return experience.some((entry) => {
    const details = String(entry?.details || '');
    const lines = details.split('\n').map((line) => line.trim()).filter(Boolean);
    return lines.length > 0;
  });
}

function hasEducationEntry(education) {
  if (!Array.isArray(education)) return false;
  return education.some((entry) => hasText(entry?.school) || hasText(entry?.degree) || hasText(entry?.details));
}

function hasProjectEntry(projects) {
  if (!Array.isArray(projects)) return false;
  return projects.some((entry) => hasText(entry?.title) || hasText(entry?.description));
}

export function computeAtsScore(resume) {
  const checks = [
    {
      key: 'name',
      points: 10,
      pass: hasText(resume.personal?.name),
      suggestion: 'Add your full name (+10 points).',
    },
    {
      key: 'email',
      points: 10,
      pass: hasText(resume.personal?.email),
      suggestion: 'Add your email (+10 points).',
    },
    {
      key: 'summaryLength',
      points: 10,
      pass: String(resume.summary || '').trim().length > 50,
      suggestion: 'Add a professional summary (+10 points).',
    },
    {
      key: 'experienceBullets',
      points: 15,
      pass: hasExperienceWithBullets(resume.experience),
      suggestion: 'Add at least one experience entry with bullets (+15 points).',
    },
    {
      key: 'education',
      points: 10,
      pass: hasEducationEntry(resume.education),
      suggestion: 'Add at least one education entry (+10 points).',
    },
    {
      key: 'skills',
      points: 10,
      pass: parseSkills(resume.skills).length >= 5,
      suggestion: 'Add at least 5 skills (+10 points).',
    },
    {
      key: 'projects',
      points: 10,
      pass: hasProjectEntry(resume.projects),
      suggestion: 'Add at least one project (+10 points).',
    },
    {
      key: 'phone',
      points: 5,
      pass: hasText(resume.personal?.phone),
      suggestion: 'Add a phone number (+5 points).',
    },
    {
      key: 'linkedin',
      points: 5,
      pass: hasText(resume.links?.linkedin),
      suggestion: 'Add a LinkedIn link (+5 points).',
    },
    {
      key: 'github',
      points: 5,
      pass: hasText(resume.links?.github),
      suggestion: 'Add a GitHub link (+5 points).',
    },
    {
      key: 'summaryVerbs',
      points: 10,
      pass: hasActionVerbInSummary(resume.summary),
      suggestion: 'Use action verbs in summary (built, led, designed, improved) (+10 points).',
    },
  ];

  const score = checks.reduce((total, item) => total + (item.pass ? item.points : 0), 0);
  const suggestions = checks.filter((item) => !item.pass).map((item) => item.suggestion);

  return {
    score: Math.min(100, score),
    suggestions,
  };
}
