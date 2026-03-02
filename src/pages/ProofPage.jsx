import ContextHeader from '../components/ContextHeader.jsx';
import './ProofPage.css';

export default function ProofPage() {
  return (
    <section className="proof-page">
      <ContextHeader
        title="Proof"
        subtitle="Artifacts placeholder for upcoming build outputs."
      />
      <div className="proof-page__card">
        <h3>Artifacts</h3>
        <p>Proof artifacts will be listed here in the next step.</p>
      </div>
    </section>
  );
}
