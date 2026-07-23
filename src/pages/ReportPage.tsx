import React, { useState } from 'react';
import { SAMPLE_TRIAGE_SESSIONS } from '../data/mockData';
import { PrintableReport } from '../components/report/PrintableReport';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Toast, ToastMessage } from '../components/ui/Toast';

export const ReportPage: React.FC = () => {
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (message: string) => {
    setToast({ id: `t-${Date.now()}`, message, type: 'success' });
  };

  const activeSession = SAMPLE_TRIAGE_SESSIONS[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-primary-500 selection:text-white">
      <Toast toast={toast} onClose={() => setToast(null)} />
      <Navbar />

      <main className="flex-1 py-8">
        <PrintableReport session={activeSession} onToast={showToast} />
      </main>

      <Footer />
    </div>
  );
};
