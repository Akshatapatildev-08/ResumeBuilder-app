import './ProofFooter.css';

export default function ProofFooter({ items }) {
  return (
    <footer className="proof-footer">
      <h4 className="proof-footer__title">Proof Footer</h4>
      <div className="proof-footer__grid">
        {items.map((item) => (
          <div key={item.label} className={`proof-footer__item ${item.done ? 'proof-footer__item--done' : ''}`}>
            <span>{item.label}</span>
            <strong>{item.done ? 'Complete' : 'Pending'}</strong>
          </div>
        ))}
      </div>
    </footer>
  );
}
