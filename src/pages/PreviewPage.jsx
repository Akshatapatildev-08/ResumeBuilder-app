import ContextHeader from '../components/ContextHeader.jsx';
import ResumePreviewShell from '../components/ResumePreviewShell.jsx';
import './PreviewPage.css';

export default function PreviewPage({ resume }) {
  return (
    <section className="preview-page">
      <ContextHeader
        title="Resume Preview"
        subtitle="Clean premium resume layout."
      />
      <div className="preview-page__canvas">
        <ResumePreviewShell resume={resume} />
      </div>
    </section>
  );
}
