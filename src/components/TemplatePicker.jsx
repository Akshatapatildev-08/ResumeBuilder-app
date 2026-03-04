import './TemplatePicker.css';

export const TEMPLATE_OPTIONS = [
  { id: 'classic', label: 'Classic' },
  { id: 'modern', label: 'Modern' },
  { id: 'minimal', label: 'Minimal' },
];

export const COLOR_OPTIONS = [
  { id: 'teal', label: 'Teal', value: 'hsl(168, 60%, 40%)' },
  { id: 'navy', label: 'Navy', value: 'hsl(220, 60%, 35%)' },
  { id: 'burgundy', label: 'Burgundy', value: 'hsl(345, 60%, 38%)' },
  { id: 'forest', label: 'Forest', value: 'hsl(150, 50%, 30%)' },
  { id: 'charcoal', label: 'Charcoal', value: 'hsl(0, 0%, 25%)' },
];

function TemplateSketch({ id }) {
  if (id === 'modern') {
    return (
      <div className="template-picker__sketch template-picker__sketch--modern">
        <div className="template-picker__modern-left" />
        <div className="template-picker__modern-right">
          <span />
          <span />
          <span />
        </div>
      </div>
    );
  }

  if (id === 'minimal') {
    return (
      <div className="template-picker__sketch template-picker__sketch--minimal">
        <span />
        <span />
        <span />
      </div>
    );
  }

  return (
    <div className="template-picker__sketch template-picker__sketch--classic">
      <span />
      <span />
      <span />
    </div>
  );
}

export default function TemplatePicker({
  template,
  onTemplateChange,
  colorValue,
  onColorChange,
}) {
  return (
    <div className="template-picker">
      <p className="template-picker__title">Template Picker</p>
      <div className="template-picker__templates">
        {TEMPLATE_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`template-picker__card${template === option.id ? ' template-picker__card--active' : ''}`}
            onClick={() => onTemplateChange(option.id)}
            aria-label={option.label}
          >
            <TemplateSketch id={option.id} />
            <span className="template-picker__label">{option.label}</span>
            {template === option.id && <span className="template-picker__check">✓</span>}
          </button>
        ))}
      </div>

      <p className="template-picker__title">Color Theme</p>
      <div className="template-picker__colors">
        {COLOR_OPTIONS.map((color) => (
          <button
            key={color.id}
            type="button"
            className={`template-picker__color${colorValue === color.value ? ' template-picker__color--active' : ''}`}
            style={{ backgroundColor: color.value }}
            onClick={() => onColorChange(color.value)}
            aria-label={color.label}
            title={color.label}
          />
        ))}
      </div>
    </div>
  );
}
