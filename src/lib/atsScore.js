function hasText(value) {
  return String(value || '').trim().length > 0;
}

function countWords(text) {
  const words = String(text || '').trim().split(/\s+/).filter(Boolean);
  return words.length;
}

function countValidEntries(list, requiredFields) {
  if (!Array.isArray(list)) return 0;
  return list.filter((entry) => requiredFields.every((field) => hasText(entry?.[field]))).length;
}

function parseSkills(skills) {
  return String(skills || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function hasNumericImpact(resume) {
  const numberPattern = /\d+(?:[.,]\d+)?\s*(?:%|x|X|k|K)?/;
  const expHas = Array.isArray(resume.experience)
    && resume.experience.some((entry) => numberPattern.test(String(entry?.details || '')));
  const projHas = Array.isArray(resume.projects)
    && resume.projects.some((entry) => numberPattern.test(String(entry?.details || '')));
  return expHas || projHas;
}

export function computeAtsScore(resume) {
  const summaryWords = countWords(resume.summary);
  const summaryOk = summaryWords >= 40 && summaryWords <= 120;
  const projectsCount = countValidEntries(resume.projects, ['name', 'details']);
  const projectsOk = projectsCount >= 2;
  const experienceCount = countValidEntries(resume.experience, ['company', 'role', 'details']);
  const experienceOk = experienceCount >= 1;
  const skillsCount = parseSkills(resume.skills).length;
  const skillsOk = skillsCount >= 8;
  const linksOk = hasText(resume.links?.github) || hasText(resume.links?.linkedin);
  const impactOk = hasNumericImpact(resume);
  const educationComplete = countValidEntries(resume.education, ['school', 'degree', 'details']) >= 1;

  const points = [
    summaryOk ? 15 : 0,
    projectsOk ? 10 : 0,
    experienceOk ? 10 : 0,
    skillsOk ? 10 : 0,
    linksOk ? 10 : 0,
    impactOk ? 15 : 0,
    educationComplete ? 10 : 0,
  ].reduce((acc, value) => acc + value, 0);

  const score = Math.min(100, points);
  const suggestions = [];

  if (!projectsOk) suggestions.push('Add at least 2 projects.');
  if (!impactOk) suggestions.push('Add measurable impact (numbers) in bullets.');
  if (!skillsOk) suggestions.push('Add more skills (target 8+).');
  if (!summaryOk) suggestions.push('Write a stronger summary (40-120 words).');
  if (!experienceOk) suggestions.push('Add at least 1 complete experience entry.');
  if (!linksOk) suggestions.push('Add GitHub or LinkedIn link.');
  if (!educationComplete) suggestions.push('Complete education fields (school, degree, details).');

  return {
    score,
    suggestions: suggestions.slice(0, 3),
  };
}
