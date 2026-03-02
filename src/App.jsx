import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout.jsx';
import HomePage from './pages/HomePage.jsx';
import BuilderPage from './pages/BuilderPage.jsx';
import PreviewPage from './pages/PreviewPage.jsx';
import ProofPage from './pages/ProofPage.jsx';
import { createEmptyResume } from './lib/resumeModel.js';

export default function App() {
  const [resume, setResume] = useState(() => createEmptyResume());

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
