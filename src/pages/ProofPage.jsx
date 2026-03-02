import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ContextHeader from '../components/ContextHeader.jsx';
import PageLayout from '../components/PageLayout.jsx';
import ProofFooter from '../components/ProofFooter.jsx';
import TopBar from '../components/TopBar.jsx';
import {
  STEPS,
  buildStatus,
  completedSteps,
  finalSubmissionText,
  firstIncompleteStep,
  getProofLinks,
  setProofLinks,
} from '../lib/buildTrack.js';
import './ProofPage.css';

export default function ProofPage() {
  const navigate = useNavigate();
  const [links, setLinks] = useState(() => getProofLinks());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const missing = firstIncompleteStep();
    if (missing !== null) {
      const target = STEPS.find((item) => item.index === missing) || STEPS[0];
      navigate(`/rb/${target.slug}`, { replace: true });
    }
  }, [navigate]);

  const done = useMemo(() => new Set(completedSteps()), [links]);
  const footerItems = useMemo(
    () =>
      STEPS.map((step) => ({
        label: `Step ${step.index}`,
        done: done.has(step.index),
      })),
    [done],
  );

  function updateLinks(patch) {
    const next = setProofLinks(patch);
    setLinks(next);
  }

  async function handleCopySubmission() {
    try {
      await navigator.clipboard.writeText(finalSubmissionText());
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <PageLayout
      topBar={<TopBar stepIndex={8} status={buildStatus()} />}
      header={<ContextHeader title="Proof Page" subtitle="Final submission details for all 8 steps." />}
      main={
        <section className="proof-main">
          <div className="card">
            <h2>8 Step Status</h2>
            <ul className="proof-main__list">
              {STEPS.map((step) => (
                <li key={step.slug} className="proof-main__item">
                  <span>{`/rb/${step.slug}`}</span>
                  <strong>{done.has(step.index) ? 'Complete' : 'Pending'}</strong>
                </li>
              ))}
            </ul>
          </div>
        </section>
      }
      side={
        <aside className="proof-side">
          <h3>Submission Links</h3>
          <label htmlFor="lovable-link">Lovable link</label>
          <input
            id="lovable-link"
            className="proof-side__input"
            value={links.lovableLink}
            onChange={(event) => updateLinks({ lovableLink: event.target.value })}
            placeholder="https://..."
          />

          <label htmlFor="github-link">GitHub link</label>
          <input
            id="github-link"
            className="proof-side__input"
            value={links.githubLink}
            onChange={(event) => updateLinks({ githubLink: event.target.value })}
            placeholder="https://..."
          />

          <label htmlFor="deploy-link">Deploy link</label>
          <input
            id="deploy-link"
            className="proof-side__input"
            value={links.deployLink}
            onChange={(event) => updateLinks({ deployLink: event.target.value })}
            placeholder="https://..."
          />

          <button className="btn btn--primary" type="button" onClick={handleCopySubmission}>
            {copied ? 'Copied' : 'Copy Final Submission'}
          </button>
        </aside>
      }
      footer={<ProofFooter items={footerItems} />}
    />
  );
}
