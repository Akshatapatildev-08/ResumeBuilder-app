import ContextHeader from '../components/ContextHeader.jsx';
import ResumePreviewShell from '../components/ResumePreviewShell.jsx';
import TemplateTabs from '../components/TemplateTabs.jsx';
import './PreviewPage.css';

export default function PreviewPage({ resume, template, setTemplate }) {
  return (
    <section className="preview-page">
      <ContextHeader
        title="Resume Preview"
        subtitle="Clean premium resume layout."
      />
      <div className="preview-page__template-row">
        <TemplateTabs value={template} onChange={setTemplate} />
      </div>
      <div className="preview-page__canvas">
        <ResumePreviewShell resume={resume} template={template} />
      </div>
    </section>
  );
}
