import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { I18nProvider } from './i18n/I18nContext';
import { LandingPage } from './pages/LandingPage';
import { AssessmentPage } from './pages/AssessmentPage';
import { ReportPage } from './pages/ReportPage';
import { AboutPage } from './pages/AboutPage';

export const App: React.FC = () => {
  return (
    <I18nProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/assessment" element={<AssessmentPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </Router>
    </I18nProvider>
  );
};

export default App;
