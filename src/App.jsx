import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout.jsx';
import HomePage from './pages/HomePage.jsx';
import BuilderPage from './pages/BuilderPage.jsx';
import PreviewPage from './pages/PreviewPage.jsx';
import ProofPage from './pages/ProofPage.jsx';
import { createEmptyResume, normalizeResume, RESUME_STORAGE_KEY } from './lib/resumeModel.js';

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

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/builder" element={<BuilderPage resume={resume} setResume={setResume} />} />
        <Route path="/preview" element={<PreviewPage resume={resume} />} />
        <Route path="/proof" element={<ProofPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
