export const TOTAL_STEPS = 8;

export const STEPS = [
  { index: 1, slug: '01-problem', title: 'Problem' },
  { index: 2, slug: '02-market', title: 'Market' },
  { index: 3, slug: '03-architecture', title: 'Architecture' },
  { index: 4, slug: '04-hld', title: 'HLD' },
  { index: 5, slug: '05-lld', title: 'LLD' },
  { index: 6, slug: '06-build', title: 'Build' },
  { index: 7, slug: '07-test', title: 'Test' },
  { index: 8, slug: '08-ship', title: 'Ship' },
];

const PROOF_LINKS_KEY = 'rb_proof_links';

function safeGet(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function artifactKey(stepIndex) {
  return `rb_step_${stepIndex}_artifact`;
}

export function getArtifact(stepIndex) {
  return (safeGet(artifactKey(stepIndex)) || '').trim();
}

export function setArtifact(stepIndex, value) {
  const next = String(value || '').trim();
  if (!next) return false;
  return safeSet(artifactKey(stepIndex), next);
}

export function isComplete(stepIndex) {
  return getArtifact(stepIndex).length > 0;
}

export function completedSteps() {
  return STEPS.filter((step) => isComplete(step.index)).map((step) => step.index);
}

export function firstIncompleteStep() {
  const step = STEPS.find((item) => !isComplete(item.index));
  return step ? step.index : null;
}

export function canAccessStep(stepIndex) {
  if (stepIndex <= 1) return true;
  for (let i = 1; i < stepIndex; i += 1) {
    if (!isComplete(i)) return false;
  }
  return true;
}

export function buildStatus() {
  const done = completedSteps().length;
  if (done === 0) return 'not-started';
  if (done === TOTAL_STEPS) return 'shipped';
  return 'in-progress';
}

export function getProofLinks() {
  try {
    const parsed = JSON.parse(safeGet(PROOF_LINKS_KEY) || '{}');
    return {
      lovableLink: String(parsed.lovableLink || ''),
      githubLink: String(parsed.githubLink || ''),
      deployLink: String(parsed.deployLink || ''),
    };
  } catch {
    return { lovableLink: '', githubLink: '', deployLink: '' };
  }
}

export function setProofLinks(updates) {
  const current = getProofLinks();
  const next = {
    lovableLink: String(updates?.lovableLink ?? current.lovableLink),
    githubLink: String(updates?.githubLink ?? current.githubLink),
    deployLink: String(updates?.deployLink ?? current.deployLink),
  };
  safeSet(PROOF_LINKS_KEY, JSON.stringify(next));
  return next;
}

export function finalSubmissionText() {
  const links = getProofLinks();
  const statusLines = STEPS.map((step) => {
    const status = isComplete(step.index) ? 'Complete' : 'Pending';
    return `Step ${step.index}: /rb/${step.slug} - ${status}`;
  });

  return [
    ...statusLines,
    '',
    `Lovable: ${links.lovableLink || 'N/A'}`,
    `GitHub: ${links.githubLink || 'N/A'}`,
    `Deploy: ${links.deployLink || 'N/A'}`,
  ].join('\n');
}
