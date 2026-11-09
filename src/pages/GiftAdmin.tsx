import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { STUDENTS, Student } from '../data/students';

export const GiftAdmin: React.FC = () => {
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'print'>('dashboard');

  const origin = (import.meta as any).env?.VITE_PUBLIC_URL || (typeof window !== 'undefined' ? window.location.origin : 'https://aiclub.org');
  const getStudentUrl = (student: Student) => `${origin}/gift/${student.slug}`;

  const downloadSingleQR = (student: Student) => {
    const svg = document.getElementById(`qr-${student.slug}`);
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    canvas.width = 600;
    canvas.height = 600;
    img.onload = () => {
      if (!ctx) return;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 50, 50, 500, 500);
      canvas.toBlob((blob) => { if (blob) saveAs(blob, `AI-Club-QR-${student.slug}.png`); });
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const downloadAllZip = async () => {
    setDownloadingZip(true);
    try {
      const zip = new JSZip();
      const folder = zip.folder("AI_Club_ChildrensDay_QRs");
      for (const student of STUDENTS) {
        const svg = document.getElementById(`qr-${student.slug}`);
        if (!svg) continue;
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 600;
        canvas.height = 600;
        await new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => {
            if (ctx) {
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(img, 50, 50, 500, 500);
              canvas.toBlob((blob) => {
                if (blob && folder) folder.file(`${student.slug}.png`, blob);
                resolve();
              });
            } else { resolve(); }
          };
          img.onerror = () => resolve();
          img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
        });
      }
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'AI-Club-Childrens-Day-2026-QRs.zip');
    } catch (err) {
      console.error(err);
    } finally {
      setDownloadingZip(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 sm:p-10 font-sans">
      <div className="print:hidden max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">ADMIN CONSOLE</span>
              <span className="text-xs text-slate-400">Children's Day 2026 Campaign</span>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">AI CLUB Student Gift &amp; QR Management</h1>
            <p className="text-sm text-slate-400 mt-1">Active Host URL: <code className="text-rose-300 bg-slate-900 px-2 py-0.5 rounded">{origin}</code></p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={() => setActiveTab(activeTab === 'dashboard' ? 'print' : 'dashboard')} className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-sm font-medium transition">
              {activeTab === 'dashboard' ? 'Printable Cards Layout (A4)' : 'Back to Dashboard'}
            </button>
            <button onClick={downloadAllZip} disabled={downloadingZip} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-medium text-sm transition shadow-lg shadow-rose-950 disabled:opacity-50">
              {downloadingZip ? 'Generating ZIP...' : 'Download All QRs (.ZIP)'}
            </button>
            {activeTab === 'print' && (
              <button onClick={() => window.print()} className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition shadow-lg shadow-emerald-950 flex items-center gap-2">
                <span>🖨️</span> Print Greeting Cards
              </button>
            )}
          </div>
        </div>
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {STUDENTS.map((student, idx) => {
              const url = getStudentUrl(student);
              return (
                <div key={student.id} className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-rose-500/30 transition-all flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <span className="text-[11px] font-mono text-slate-500">#{idx + 1}</span>
                      <h2 className="text-lg font-semibold text-white">{student.name}</h2>
                      <a href={url} target="_blank" rel="noreferrer" className="text-xs text-rose-400 hover:underline break-all block mt-1">/gift/{student.slug}</a>
                    </div>
                    <div className="p-2 bg-white rounded-xl shadow-md shrink-0">
                      <QRCodeSVG id={`qr-${student.slug}`} value={url} size={84} level="H" includeMargin={false} />
                    </div>
                  </div>
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <button onClick={() => downloadSingleQR(student)} className="text-slate-300 hover:text-white font-medium transition">Download PNG ↓</button>
                    <a href={url} target="_blank" rel="noreferrer" className="text-rose-400 hover:text-rose-300 font-medium">Preview Gift Page ↗</a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className={activeTab === 'print' ? 'block' : 'hidden print:block'}>
        <div className="max-w-[210mm] mx-auto p-0">
          <div className="grid grid-cols-2 gap-4 print:gap-3">
            {STUDENTS.map((student) => {
              const url = getStudentUrl(student);
              return (
                <div key={`card-${student.id}`} className="greeting-card relative border-2 border-dashed border-rose-300/40 print:border-rose-400 bg-white text-slate-900 rounded-3xl p-6 print:p-5 flex flex-col justify-between aspect-[1/1.38] shadow-sm page-break-inside-avoid">
                  <div className="text-center space-y-1">
                    <div className="text-rose-600 font-extrabold text-sm tracking-widest uppercase">AI CLUB</div>
                    <p className="text-[11px] tracking-wider text-rose-400 uppercase font-semibold">HAPPY CHILDREN'S DAY 2026</p>
                    <div className="h-0.5 w-12 bg-rose-200 mx-auto my-2" />
                  </div>
                  <div className="text-center py-2">
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-light">Prepared especially for</p>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-rose-950 mt-1">{student.name}</h3>
                  </div>
                  <div className="flex flex-col items-center justify-center my-1">
                    <div className="p-3 bg-white rounded-2xl border-2 border-rose-100 shadow-md">
                      <QRCodeSVG value={url} size={135} level="H" includeMargin={false} />
                    </div>
                    <span className="mt-3 text-[10px] font-bold text-rose-600 uppercase tracking-wider text-center">SCAN TO REVEAL YOUR AR SURPRISE! 🌸</span>
                  </div>
                  <div className="border-t border-rose-100 pt-3 text-center space-y-1">
                    <p className="text-[10px] text-slate-600 italic leading-snug">"Every great innovation starts with curiosity. Keep dreaming, keep exploring, and keep creating!"</p>
                    <p className="text-[11px] font-semibold text-rose-600">With Love, Shadha Basheer Ahamed maam , AI CLUB ❤️</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};