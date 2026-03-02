import { Link } from 'react-router-dom';
import ContextHeader from '../components/ContextHeader.jsx';
import './HomePage.css';

export default function HomePage() {
  return (
    <section className="home-page">
      <ContextHeader
        title="AI Resume Builder"
        subtitle="Premium structure-first workflow."
      />
      <div className="home-page__hero">
        <h2>Build a Resume That Gets Read.</h2>
        <Link to="/builder" className="home-page__cta">
          Start Building
        </Link>
      </div>
    </section>
  );
}
