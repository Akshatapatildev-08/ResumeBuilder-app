import './TopBar.css';

const STATUS_LABELS = {
  'not-started': 'Not Started',
  'in-progress': 'In Progress',
  shipped: 'Shipped',
};

export default function TopBar({ stepIndex, status }) {
  const statusLabel = STATUS_LABELS[status] || status;

  return (
    <header className="topbar">
      <div className="topbar__left">AI Resume Builder</div>
      <div className="topbar__center">{`Project 3 — Step ${stepIndex} of 8`}</div>
      <div className={`topbar__badge topbar__badge--${status}`}>{statusLabel}</div>
    </header>
  );
}
