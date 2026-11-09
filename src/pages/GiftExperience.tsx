import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getStudentBySlug, CAMPAIGN_INFO } from '../data/students';
import { BouquetViewer } from '../components/gift/BouquetViewer';
import { PetalCanvas } from '../components/gift/PetalCanvas';

export const GiftExperience: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const student = slug ? getStudentBySlug(slug) : undefined;
  const [opened, setOpened] = useState(false);

  if (!student) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-3xl mb-4">🌸</div>
        <h1 className="text-2xl font-serif font-bold text-rose-100 mb-2">Student Invitation Not Found</h1>
        <p className="text-slate-400 max-w-sm mb-6 text-sm">Please check the link on your card or scan your personal QR code again.</p>
        <Link to="/gift-admin" className="px-6 py-2.5 rounded-full bg-rose-600 text-white font-medium hover:bg-rose-500 transition-colors text-sm">Return to Hub</Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-950 via-[#180a12] to-[#0c0407] text-slate-100 overflow-x-hidden selection:bg-rose-500 selection:text-white font-sans">
      <PetalCanvas />
      <header className="relative z-20 pt-6 px-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-950/40 border border-rose-500/30 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
          <span className="text-[11px] font-semibold tracking-widest text-rose-200 uppercase">AI CLUB SPECIAL EDITION</span>
        </div>
      </header>

      {!opened ? (
        <main className="relative z-20 min-h-[82vh] flex items-center justify-center px-4">
          <div className="w-full max-w-md p-8 sm:p-10 text-center rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-rose-400/20 shadow-2xl shadow-rose-950/50">
            <div className="text-5xl sm:text-6xl mb-6 animate-bounce">🎁</div>
            <p className="text-rose-400 uppercase tracking-widest text-xs font-semibold mb-2">CHILDREN'S DAY 2026</p>
            <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-rose-50 tracking-tight mb-3">Hey, {student.name}! 🌸</h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 font-light">Someone has prepared a little surprise just for you.</p>
            <button onClick={() => setOpened(true)} className="w-full group relative inline-flex items-center justify-center px-8 py-4 text-base font-semibold tracking-wider uppercase text-white bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 rounded-2xl shadow-lg shadow-rose-600/30 hover:shadow-rose-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
              Open Your Gift <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
            </button>
            <p className="mt-6 text-xs text-slate-500 tracking-wide">Crafted with care by AI CLUB</p>
          </div>
        </main>
      ) : (
        <main className="relative z-20 max-w-2xl mx-auto px-4 py-8 space-y-10 animate-fadeIn">
          <div className="text-center space-y-2">
            <p className="text-xs sm:text-sm uppercase tracking-widest text-rose-400 font-semibold">{CAMPAIGN_INFO.title}</p>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight drop-shadow-md">{CAMPAIGN_INFO.heading}</h1>
            <div className="pt-2">
              <span className="inline-block px-5 py-2 rounded-full bg-gradient-to-r from-rose-500/20 via-pink-500/20 to-rose-500/20 border border-rose-300/30 text-rose-100 text-lg sm:text-xl font-serif">{student.name}</span>
            </div>
          </div>
          <div className="w-full">
            <BouquetViewer />
            <p className="text-center text-xs text-rose-300/70 mt-3 font-light">Tap the AR button on your smartphone camera to place your bouquet in your room!</p>
          </div>
          <div className="relative p-8 sm:p-10 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-rose-300/20 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-rose-500/20 pb-4">
              <span className="font-serif italic text-rose-200 text-lg">Personal Message</span>
              <span className="text-xs uppercase tracking-widest text-slate-400">14 November 2026</span>
            </div>
            <div className="space-y-4 text-slate-200 leading-relaxed font-light text-base sm:text-lg">
              <p className="font-medium text-rose-100">Dear {student.name},</p>
              <p>Your curiosity is your superpower. Your imagination is your greatest tool. Never stop asking questions, learning new things and exploring the world around you.</p>
              <p className="font-serif italic text-rose-200">Keep dreaming. Keep creating. Keep shining!</p>
              <p className="font-medium text-rose-300 pt-2">Happy Children's Day!</p>
            </div>
            <div className="pt-6 border-t border-rose-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400">With love,</p>
                <p className="text-base font-semibold text-rose-200">{CAMPAIGN_INFO.footer}</p>
              </div>
              <div className="text-xs text-slate-400 italic max-w-[260px]">"{CAMPAIGN_INFO.subheading}"</div>
            </div>
          </div>
        </main>
      )}
      <footer className="relative z-20 py-8 text-center text-xs text-slate-500 tracking-wider">
        © 2026 AI CLUB • All Rights Reserved
      </footer>
    </div>
  );
};