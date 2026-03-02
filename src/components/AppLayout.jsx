import { NavLink, Outlet } from 'react-router-dom';
import './AppLayout.css';

function NavItem({ to, label }) {
  return (
    <NavLink to={to} className={({ isActive }) => `app-layout__nav-link${isActive ? ' app-layout__nav-link--active' : ''}`}>
      {label}
    </NavLink>
  );
}

export default function AppLayout() {
  return (
    <div className="app-layout">
      <header className="app-layout__top-nav">
        <div className="app-layout__brand">AI Resume Builder</div>
        <nav className="app-layout__nav">
          <NavItem to="/builder" label="Builder" />
          <NavItem to="/preview" label="Preview" />
          <NavItem to="/proof" label="Proof" />
        </nav>
      </header>
      <main className="app-layout__content">
        <Outlet />
      </main>
    </div>
  );
}
