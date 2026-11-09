import React, { useRef, useState, useEffect } from 'react';
import { CAMPAIGN_INFO } from '../../data/students';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

export const BouquetViewer: React.FC = () => {
  const [modelLoaded, setModelLoaded] = useState(false);
  const [modelError, setModelError] = useState(false);
  const modelViewerRef = useRef<any>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!modelLoaded && !modelError) setModelError(true);
    }, 12000);
    return () => clearTimeout(timer);
  }, [modelLoaded, modelError]);

  const handleLaunchAR = () => {
    if (modelViewerRef.current && typeof modelViewerRef.current.activateAR === 'function') {
      modelViewerRef.current.activateAR();
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto aspect-square rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-b from-rose-950/20 via-pink-950/10 to-rose-950/30 border border-rose-300/20 backdrop-blur-md">
      {!modelLoaded && !modelError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 z-10 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-10 h-10 border-4 border-rose-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-rose-200 tracking-wider font-light">Arranging your fresh flowers...</p>
        </div>
      )}
      {modelError && !modelLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 z-10 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-3xl mb-3">⚠️</div>
          <p className="text-xs text-rose-300 text-center px-4">AR model unavailable on this device</p>
        </div>
      )}
      <model-viewer
        ref={modelViewerRef}
        src={CAMPAIGN_INFO.bouquetModelGlb}
        ios-src={CAMPAIGN_INFO.bouquetModelUsdz || undefined}
        alt="Photorealistic flower bouquet for Children's Day"
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        auto-rotate
        auto-rotate-delay={300}
        rotation-per-second="25deg"
        shadow-intensity="1.5"
        shadow-softness="0.8"
        exposure="1.15"
        loading="eager"
        onLoad={() => setModelLoaded(true)}
        onError={() => setModelError(true)}
        className="w-full h-full cursor-grab active:cursor-grabbing outline-none"
      >
        <div slot="ar-button" className="hidden" />
      </model-viewer>
      <div className="absolute bottom-4 inset-x-0 flex justify-center px-4 pointer-events-auto">
        <button
          onClick={handleLaunchAR}
          className="group relative inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold tracking-wider uppercase text-white bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 rounded-full shadow-lg shadow-rose-600/40 hover:shadow-rose-600/60 hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20"
        >
          <svg className="w-5 h-5 mr-2 -ml-1 text-white animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
          </svg>
          View Bouquet in AR
        </button>
      </div>
      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] tracking-widest uppercase text-rose-200">
        Touch &amp; Drag to Rotate 3D
      </div>
    </div>
  );
};