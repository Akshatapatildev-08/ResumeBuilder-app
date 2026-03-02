import './TemplateTabs.css';

const OPTIONS = [
  { id: 'classic', label: 'Classic' },
  { id: 'modern', label: 'Modern' },
  { id: 'minimal', label: 'Minimal' },
];

export default function TemplateTabs({ value, onChange }) {
  return (
    <div className="template-tabs" role="tablist" aria-label="Resume templates">
      {OPTIONS.map((option) => (
        <button
          key={option.id}
          type="button"
          role="tab"
          aria-selected={value === option.id}
          className={`template-tabs__tab${value === option.id ? ' template-tabs__tab--active' : ''}`}
          onClick={() => onChange(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
