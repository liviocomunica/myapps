import React, { useState } from 'react';
import { AppItem } from '../types';
import { 
  X, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight, 
  Layers, 
  Cpu, 
  CheckCircle2, 
  Tag, 
  Calendar,
  Sparkles,
  MonitorSmartphone,
  ShieldCheck
} from 'lucide-react';

interface AppModalProps {
  app: AppItem | null;
  onClose: () => void;
}

export const AppModal: React.FC<AppModalProps> = ({ app, onClose }) => {
  const [activeScreenIndex, setActiveScreenIndex] = useState(0);

  if (!app) return null;

  const screens = (app.schermate && app.schermate.length > 0)
    ? app.schermate
    : ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80'];

  const nextScreen = () => {
    setActiveScreenIndex((prev) => (prev + 1) % screens.length);
  };

  const prevScreen = () => {
    setActiveScreenIndex((prev) => (prev - 1 + screens.length) % screens.length);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">Dettaglio Applicazione</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-700/80 rounded-lg transition-colors"
            title="Chiudi modale"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 md:p-8 max-h-[80vh] overflow-y-auto space-y-8">
          {/* Top Title & Badges */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
                  {app.categoria}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-950/80 text-purple-400 border border-purple-800/60">
                  {app.tipologia}
                </span>
                {app.dataAggiunta && (
                  <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    {app.dataAggiunta}
                  </span>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                {app.nome}
              </h2>
            </div>

            <a
              href={app.linkApp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-cyan-950/40 hover:shadow-cyan-900/60 transition-all transform hover:-translate-y-0.5"
            >
              <span>Apri Web App</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Screenshot Carousel */}
          <div className="space-y-3">
            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 group">
              <img
                src={screens[activeScreenIndex]}
                alt={`${app.nome} schermata ${activeScreenIndex + 1}`}
                className="w-full h-full object-cover transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              
              {/* Carousel Controls */}
              {screens.length > 1 && (
                <>
                  <button
                    onClick={prevScreen}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/80 text-white hover:bg-slate-800 border border-slate-700/60 backdrop-blur-sm transition-opacity opacity-80 hover:opacity-100"
                    title="Schermata precedente"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextScreen}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/80 text-white hover:bg-slate-800 border border-slate-700/60 backdrop-blur-sm transition-opacity opacity-80 hover:opacity-100"
                    title="Schermata successiva"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-slate-950/80 border border-slate-800/80 backdrop-blur-sm text-xs text-slate-300 font-mono">
                    Schermata {activeScreenIndex + 1} di {screens.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {screens.length > 1 && (
              <div className="grid grid-cols-3 gap-3">
                {screens.map((screen, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveScreenIndex(idx)}
                    className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                      activeScreenIndex === idx
                        ? 'border-cyan-400 ring-2 ring-cyan-500/20 shadow-md'
                        : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={screen}
                      alt={`Anteprima ${idx + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Detailed Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Descrizione Completa
            </h3>
            <div className="text-slate-300 leading-relaxed text-sm sm:text-base whitespace-pre-line bg-slate-950/40 p-4 rounded-xl border border-slate-800/60">
              {app.descrizioneDettagliata || app.descrizioneBreve}
            </div>
          </div>

          {/* Specs & Requirements Dual Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* System Requirements */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
                <Cpu className="w-4 h-4" />
                <span>Requisiti di Sistema</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {app.requisiti || 'Qualsiasi browser moderno supportato (Chrome, Safari, Firefox, Edge).'}
              </p>
            </div>

            {/* Platform Specifications */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm">
                <MonitorSmartphone className="w-4 h-4" />
                <span>Specifiche della Piattaforma</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {app.specifichePiattaforma || 'Web Desktop e Mobile, 100% Client-Side, Responsive UI.'}
              </p>
            </div>
          </div>

          {/* Tags */}
          {app.tags && app.tags.length > 0 && (
            <div className="pt-2">
              <div className="flex flex-wrap items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                {app.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-md bg-slate-800/60 text-slate-300 border border-slate-700/50"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Action Footer */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verificato e compatibile con hosting statico GitHub Pages</span>
            </div>
            
            <a
              href={app.linkApp}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-cyan-950/50 transition-all"
            >
              <span>Lancia Applicazione</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
