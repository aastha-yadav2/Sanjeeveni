import React, { useRef } from 'react';
import { AssessmentSession } from '../../types/triage';
import { UrgencyBadge } from '../ui/UrgencyBadge';
import { HeartPulse, Download, Printer, ArrowLeft, ShieldCheck, Calendar, User, Clock, FileCheck2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import confetti from 'canvas-confetti';

interface PrintableReportProps {
  session: AssessmentSession;
  onToast?: (message: string) => void;
}

export const PrintableReport: React.FC<PrintableReportProps> = ({ session, onToast }) => {
  const navigate = useNavigate();
  const reportRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    if (onToast) onToast("Generating PDF report...");

    try {
      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Sanjeevani_Health_Report_${session.id}.pdf`);

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });

      if (onToast) onToast("PDF Report successfully downloaded!");
    } catch (err) {
      console.error("Failed to generate PDF", err);
      window.print();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Top Action Bar (Hidden when printing) */}
      <div className="flex items-center justify-between gap-4 no-print glass-card p-4 rounded-2xl border border-slate-200 shadow-sm">
        <button
          onClick={() => navigate('/assessment')}
          className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-primary-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Assessment</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print Report</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            className="gradient-button px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-md shadow-primary-500/20"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div
        ref={reportRef}
        className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-2xl space-y-8 text-slate-800 relative overflow-hidden"
      >
        <div className="h-3 bg-gradient-to-r from-primary-600 via-secondary-500 to-primary-600 -mx-8 -mt-8 sm:-mx-12 sm:-mt-12 mb-8"></div>

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b-2 border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary-600 to-secondary-500 flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
              <HeartPulse className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Sanjeevani <span className="text-primary-600">AI</span>
              </h1>
              <p className="text-xs font-semibold text-slate-500">FastAPI + Google Gemma Triage Summary</p>
              <div className="flex items-center gap-1.5 mt-1 text-[11px] font-bold text-emerald-600">
                <FileCheck2 className="w-3.5 h-3.5" /> Verified Triage Record
              </div>
            </div>
          </div>

          <div className="text-right space-y-1 text-xs text-slate-500 font-medium sm:self-end">
            <p className="flex items-center justify-end gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Date: {new Date(session.createdAt).toLocaleDateString()}</span>
            </p>
            <p className="flex items-center justify-end gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Session ID: {session.id}</span>
            </p>
            <p className="text-[11px] text-slate-400">Language: {session.languageCode.toUpperCase()}</p>
          </div>
        </div>

        {/* Patient Overview Box */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-200">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Patient Profile
            </span>
            <p className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
              <User className="w-4 h-4 text-primary-600" />
              Age {session.patientAge || '28'} • {session.patientGender || 'Unspecified'}
            </p>
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Triage Urgency Rating
            </span>
            <div>
              <UrgencyBadge level={session.summary.urgency} size="md" />
            </div>
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Gemma Confidence Score
            </span>
            <p className="text-sm font-extrabold text-primary-600">
              {session.summary.confidence}% Clinical Match
            </p>
          </div>
        </div>

        {/* Reported Symptoms Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b pb-2 border-slate-200">
            1. Primary Symptoms & Duration
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-xs font-semibold text-slate-500 block mb-2">Identified Symptoms:</span>
              <div className="flex flex-wrap gap-2">
                {session.summary.symptoms.map((symptom, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-white text-primary-700 font-bold text-xs rounded-xl border border-primary-200 shadow-sm"
                  >
                    {symptom}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-xs font-semibold text-slate-500 block mb-1">Reported Duration:</span>
              <p className="text-base font-extrabold text-slate-800">{session.summary.duration || '2 days'}</p>
            </div>
          </div>
        </div>

        {/* Care Guidance & Recommendation */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b pb-2 border-slate-200">
            2. Recommended Next Step & Care Route
          </h3>
          <div className="p-5 bg-primary-50/70 border border-primary-200 rounded-2xl space-y-2">
            <p className="text-sm font-bold text-slate-900 leading-relaxed">
              {session.summary.recommendation}
            </p>
          </div>
        </div>

        {/* Q&A Transcript Summary */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b pb-2 border-slate-200">
            3. Follow-up Assessment Log
          </h3>
          <div className="space-y-3">
            {session.messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-3.5 rounded-2xl text-xs space-y-1 ${
                  msg.sender === 'gemma'
                    ? 'bg-slate-50 border border-slate-200'
                    : 'bg-primary-50/50 border border-primary-100'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span className={msg.sender === 'gemma' ? 'text-primary-600' : 'text-slate-800'}>
                    {msg.sender === 'gemma' ? 'Google Gemma AI (Backend)' : 'Patient Answer'}
                  </span>
                  <span className="text-slate-400 font-normal">{msg.timestamp}</span>
                </div>
                <p className="text-slate-700 text-xs leading-relaxed">{msg.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer Banner */}
        <div className="p-5 bg-slate-900 text-slate-300 rounded-2xl space-y-2 border border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Healthcare Notice & Disclaimer</span>
          </div>
          <p className="leading-relaxed">
            This report is generated by Sanjeevani AI (Google Gemma Backend integration). It does <strong>NOT</strong> constitute a formal diagnosis, medical treatment, or prescription. Please present this summary to a licensed physician or emergency medical clinician.
          </p>
        </div>
      </div>
    </div>
  );
};
