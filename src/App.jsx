import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout.jsx';
import HomePage from './pages/HomePage.jsx';
import BuilderPage from './pages/BuilderPage.jsx';
import PreviewPage from './pages/PreviewPage.jsx';
import ProofPage from './pages/ProofPage.jsx';
import { createEmptyResume, normalizeResume, RESUME_STORAGE_KEY } from './lib/resumeModel.js';

const TEMPLATE_STORAGE_KEY = 'resumeBuilderTemplate';
const ACCENT_STORAGE_KEY = 'resumeBuilderAccent';
const TEMPLATE_OPTIONS = ['classic', 'modern', 'minimal'];
const ACCENT_OPTIONS = [
  'hsl(168, 60%, 40%)',
  'hsl(220, 60%, 35%)',
  'hsl(345, 60%, 38%)',
  'hsl(150, 50%, 30%)',
  'hsl(0, 0%, 25%)',
];

export default function App() {
  const [resume, setResume] = useState(() => {
    try {
      const raw = localStorage.getItem(RESUME_STORAGE_KEY);
      if (!raw) return createEmptyResume();
      return normalizeResume(JSON.parse(raw));
    } catch {
      return createEmptyResume();
    }
  });

  useEffect(() => {
    localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(resume));
  }, [resume]);

  const [template, setTemplate] = useState(() => {
    try {
      const saved = String(localStorage.getItem(TEMPLATE_STORAGE_KEY) || '').toLowerCase();
      return TEMPLATE_OPTIONS.includes(saved) ? saved : 'classic';
    } catch {
      return 'classic';
    }
  });

  useEffect(() => {
    localStorage.setItem(TEMPLATE_STORAGE_KEY, template);
  }, [template]);

  const [accentColor, setAccentColor] = useState(() => {
    try {
      const saved = String(localStorage.getItem(ACCENT_STORAGE_KEY) || '');
      return ACCENT_OPTIONS.includes(saved) ? saved : 'hsl(168, 60%, 40%)';
    } catch {
      return 'hsl(168, 60%, 40%)';
    }
  });

  useEffect(() => {
    localStorage.setItem(ACCENT_STORAGE_KEY, accentColor);
  }, [accentColor]);

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/builder"
          element={(
            <BuilderPage
              resume={resume}
              setResume={setResume}
              template={template}
              setTemplate={setTemplate}
              accentColor={accentColor}
              setAccentColor={setAccentColor}
            />
          )}
        />
        <Route
          path="/preview"
          element={(
            <PreviewPage
              resume={resume}
              template={template}
              setTemplate={setTemplate}
              accentColor={accentColor}
              setAccentColor={setAccentColor}
            />
          )}
        />
        <Route path="/proof" element={<ProofPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
