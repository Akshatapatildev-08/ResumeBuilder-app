import { useState } from 'react';
import './BuildPanel.css';

export default function BuildPanel({ defaultText = '' }) {
  const [text, setText] = useState(defaultText);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState('');

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="build-panel">
      <h3 className="build-panel__title">Build Panel</h3>

      <label className="build-panel__label" htmlFor="lovable-textarea">
        Copy This Into Lovable
      </label>
      <textarea
        id="lovable-textarea"
        className="build-panel__textarea"
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={8}
      />

      <button className="btn btn--secondary" type="button" onClick={handleCopy}>
        {copied ? 'Copied' : 'Copy'}
      </button>
      <button
        className="btn btn--primary"
        type="button"
        onClick={() => window.open('https://lovable.dev/', '_blank', 'noopener,noreferrer')}
      >
        Build in Lovable
      </button>
      <button className="btn btn--secondary" type="button" onClick={() => setStatus('It Worked')}>
        It Worked
      </button>
      <button className="btn btn--secondary" type="button" onClick={() => setStatus('Error')}>
        Error
      </button>
      <button className="btn btn--ghost" type="button" onClick={() => setStatus('Add Screenshot')}>
        Add Screenshot
      </button>

      {status && <p className="build-panel__status">{status}</p>}
    </div>
  );
}
