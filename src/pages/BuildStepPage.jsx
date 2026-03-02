import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BuildPanel from '../components/BuildPanel.jsx';
import ContextHeader from '../components/ContextHeader.jsx';
import PageLayout from '../components/PageLayout.jsx';
import ProofFooter from '../components/ProofFooter.jsx';
import TopBar from '../components/TopBar.jsx';
import {
  STEPS,
  buildStatus,
  canAccessStep,
  completedSteps,
  firstIncompleteStep,
  getArtifact,
  setArtifact,
} from '../lib/buildTrack.js';
import './BuildStepPage.css';

const PANEL_TEXT = {
  1: 'Define the problem statement and constraints.',
  2: 'Map market assumptions and audience.',
  3: 'Outline system architecture blocks and flow.',
  4: 'Draft high-level design.',
  5: 'Draft low-level design details.',
  6: 'Implement build rail and storage contracts.',
  7: 'Validate gating and progression behavior.',
  8: 'Prepare ship checklist and release notes.',
};

export default function BuildStepPage({ stepIndex }) {
  const navigate = useNavigate();
  const step = STEPS.find((item) => item.index === stepIndex);
  const [artifact, setArtifactDraft] = useState('');
  const [uploaded, setUploaded] = useState(false);

  useEffect(() => {
    if (!step) {
      navigate('/rb/01-problem', { replace: true });
      return;
    }

    if (!canAccessStep(stepIndex)) {
      const lockIndex = firstIncompleteStep() || 1;
      const target = STEPS.find((item) => item.index === lockIndex) || STEPS[0];
      navigate(`/rb/${target.slug}`, { replace: true });
      return;
    }

    const saved = getArtifact(stepIndex);
    setArtifactDraft(saved);
    setUploaded(saved.length > 0);
  }, [navigate, step, stepIndex]);

  const footerItems = useMemo(() => {
    const done = new Set(completedSteps());
    return STEPS.map((item) => ({
      label: `Step ${item.index}`,
      done: done.has(item.index),
    }));
  }, [uploaded, stepIndex]);

  function handleUpload() {
    if (!setArtifact(stepIndex, artifact)) return;
    setUploaded(true);
  }

  function handleNext() {
    if (!uploaded) return;
    if (stepIndex === 8) {
      navigate('/rb/proof');
      return;
    }
    const next = STEPS.find((item) => item.index === stepIndex + 1);
    if (next) navigate(`/rb/${next.slug}`);
  }

  function handlePrevious() {
    if (stepIndex === 1) return;
    const prev = STEPS.find((item) => item.index === stepIndex - 1);
    if (prev) navigate(`/rb/${prev.slug}`);
  }

  return (
    <PageLayout
      topBar={<TopBar stepIndex={stepIndex} status={buildStatus()} />}
      header={
        <ContextHeader
          title={`Step ${stepIndex}: ${step?.title || 'Build'}`}
          subtitle={`Route: /rb/${step?.slug || '01-problem'}`}
        />
      }
      main={
        <section className="step-main">
          <div className="card">
            <h2>Main Workspace</h2>
            <p>No skipping is allowed. Upload artifact to unlock Next.</p>
            <label className="step-main__label" htmlFor={`artifact-step-${stepIndex}`}>
              Artifact Storage Key: {`rb_step_${stepIndex}_artifact`}
            </label>
            <textarea
              id={`artifact-step-${stepIndex}`}
              className="step-main__textarea"
              value={artifact}
              onChange={(event) => {
                setArtifactDraft(event.target.value);
                setUploaded(false);
              }}
              rows={10}
              placeholder="Paste artifact text, notes, or link."
            />
            <div className="step-main__actions">
              <button className="btn btn--secondary" type="button" onClick={handleUpload}>
                Upload Artifact
              </button>
              <button className="btn btn--ghost" type="button" onClick={handlePrevious} disabled={stepIndex === 1}>
                Previous
              </button>
              <button className="btn btn--primary" type="button" onClick={handleNext} disabled={!uploaded}>
                {stepIndex === 8 ? 'Go to Proof' : 'Next'}
              </button>
            </div>
          </div>
        </section>
      }
      side={<BuildPanel defaultText={PANEL_TEXT[stepIndex] || ''} />}
      footer={<ProofFooter items={footerItems} />}
    />
  );
}
