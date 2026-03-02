import { Navigate, Route, Routes } from 'react-router-dom';
import BuildStepPage from './pages/BuildStepPage.jsx';
import ProofPage from './pages/ProofPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/rb/01-problem" replace />} />
      <Route path="/rb/01-problem" element={<BuildStepPage stepIndex={1} />} />
      <Route path="/rb/02-market" element={<BuildStepPage stepIndex={2} />} />
      <Route path="/rb/03-architecture" element={<BuildStepPage stepIndex={3} />} />
      <Route path="/rb/04-hld" element={<BuildStepPage stepIndex={4} />} />
      <Route path="/rb/05-lld" element={<BuildStepPage stepIndex={5} />} />
      <Route path="/rb/06-build" element={<BuildStepPage stepIndex={6} />} />
      <Route path="/rb/07-test" element={<BuildStepPage stepIndex={7} />} />
      <Route path="/rb/08-ship" element={<BuildStepPage stepIndex={8} />} />
      <Route path="/rb/proof" element={<ProofPage />} />
      <Route path="*" element={<Navigate to="/rb/01-problem" replace />} />
    </Routes>
  );
}
