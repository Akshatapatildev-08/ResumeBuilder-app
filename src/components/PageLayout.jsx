import './PageLayout.css';

export default function PageLayout({ topBar, header, main, side, footer }) {
  return (
    <div className="page">
      {topBar}
      {header}
      <section className="workspace">
        <main className="workspace__main">{main}</main>
        <aside className="workspace__side">{side}</aside>
      </section>
      {footer}
    </div>
  );
}
