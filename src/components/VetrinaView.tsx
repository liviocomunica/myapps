import React, { useState, useMemo } from 'react';
import { AppItem } from '../types';
import { AppModal } from './AppModal';
import { 
  Search, 
  Filter, 
  Sparkles, 
  ExternalLink, 
  Info, 
  Layers, 
  Cpu, 
  Tag, 
  ArrowUpRight,
  ShieldCheck,
  Smartphone,
  BookOpen
} from 'lucide-react';

interface VetrinaViewProps {
  apps: AppItem[];
  isLoading?: boolean;
  onOpenGuide?: () => void;
  onGoToAdmin?: () => void;
}

export const VetrinaView: React.FC<VetrinaViewProps> = ({
  apps,
  isLoading = false,
  onOpenGuide,
  onGoToAdmin
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState<string>('Tutte');
  const [selectedTipologia, setSelectedTipologia] = useState<string>('Tutte');
  const [selectedApp, setSelectedApp] = useState<AppItem | null>(null);

  // Extract unique categories & typologies dynamically
  const categorie = useMemo(() => {
    const set = new Set<string>();
    apps.forEach((app) => {
      if (app.categoria) set.add(app.categoria);
    });
    return ['Tutte', ...Array.from(set).sort()];
  }, [apps]);

  const tipologie = useMemo(() => {
    const set = new Set<string>();
    apps.forEach((app) => {
      if (app.tipologia) set.add(app.tipologia);
    });
    return ['Tutte', ...Array.from(set).sort()];
  }, [apps]);

  // Filter apps in real-time
  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      const matchSearch =
        searchQuery === '' ||
        app.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.descrizioneBreve.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.descrizioneDettagliata.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (app.tags && app.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchCategoria =
        selectedCategoria === 'Tutte' || app.categoria === selectedCategoria;

      const matchTipologia =
        selectedTipologia === 'Tutte' || app.tipologia === selectedTipologia;

      return matchSearch && matchCategoria && matchTipologia;
    });
  }, [apps, searchQuery, selectedCategoria, selectedTipologia]);

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-6 sm:p-10 text-center sm:text-left">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>GitHub Pages Portfolio Showcase</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              Vetrina Applicazioni & Micro-SaaS
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Esplora la collezione dinamica di applicativi web. Schede generate automaticamente via Gemini AI e gestite con architettura serverless su GitHub Pages.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {onOpenGuide && (
              <button
                onClick={onOpenGuide}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 rounded-xl text-sm font-medium transition-colors"
              >
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>Guida Deployment</span>
              </button>
            )}
            {onGoToAdmin && (
              <button
                onClick={onGoToAdmin}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-cyan-950/50 transition-all transform hover:-translate-y-0.5 text-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>Pannello Admin</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search Bar & Filters Section */}
      <div className="p-4 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 backdrop-blur-md">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Live Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cerca per nome, tag o descrizione..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white bg-slate-800 px-1.5 py-0.5 rounded"
              >
                Cancella
              </button>
            )}
          </div>

          {/* Quick Counter */}
          <div className="text-xs text-slate-400 font-medium">
            Mostrando <span className="text-cyan-400 font-bold">{filteredApps.length}</span> di {apps.length} applicativi
          </div>
        </div>

        {/* Filter Badges */}
        <div className="pt-2 border-t border-slate-800/80 space-y-3">
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-cyan-400" /> Categorie:
            </span>
            {categorie.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategoria(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  selectedCategoria === cat
                    ? 'bg-cyan-500 text-white shadow-md shadow-cyan-950'
                    : 'bg-slate-950 hover:bg-slate-800 text-slate-400 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Typologies */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-purple-400" /> Tipologie:
            </span>
            {tipologie.map((tip) => (
              <button
                key={tip}
                onClick={() => setSelectedTipologia(tip)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  selectedTipologia === tip
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-950'
                    : 'bg-slate-950 hover:bg-slate-800 text-slate-400 border border-slate-800'
                }`}
              >
                {tip}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of App Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-96 rounded-2xl bg-slate-900 border border-slate-800 animate-pulse p-4 space-y-4">
              <div className="h-48 bg-slate-800 rounded-xl"></div>
              <div className="h-6 bg-slate-800 rounded w-3/4"></div>
              <div className="h-12 bg-slate-800 rounded"></div>
            </div>
          ))}
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-4">
          <div className="inline-flex p-4 rounded-full bg-slate-800/60 text-slate-400">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-slate-200">Nessuna app trovata</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Prova a cambiare i filtri selezionati o il termine di ricerca inserito nella barra in alto.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategoria('Tutte');
              setSelectedTipologia('Tutte');
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
          >
            Ripristina Filtri
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApps.map((app) => {
            const firstScreenshot = (app.schermate && app.schermate[0]) || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80';
            return (
              <div
                key={app.id}
                className="group relative flex flex-col justify-between rounded-2xl bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {/* Image Thumbnail Container */}
                <div>
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                    <img
                      src={firstScreenshot}
                      alt={app.nome}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80"></div>

                    {/* Category & Typology Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase bg-slate-950/80 text-cyan-400 border border-cyan-800/60 backdrop-blur-md">
                        {app.categoria}
                      </span>
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase bg-slate-950/80 text-purple-400 border border-purple-800/60 backdrop-blur-md">
                        {app.tipologia}
                      </span>
                    </div>
                  </div>

                  {/* Card Main Info */}
                  <div className="p-5 space-y-3">
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                      {app.nome}
                    </h3>

                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed line-clamp-3">
                      {app.descrizioneBreve}
                    </p>

                    {/* Tags preview */}
                    {app.tags && app.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {app.tags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-5 pt-0 flex items-center justify-between gap-3 border-t border-slate-800/40 mt-3">
                  <button
                    onClick={() => setSelectedApp(app)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700/60 transition-colors"
                  >
                    <Info className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Dettagli</span>
                  </button>

                  <a
                    href={app.linkApp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center p-2 bg-cyan-950 hover:bg-cyan-900 text-cyan-400 rounded-xl border border-cyan-800/60 transition-colors"
                    title={`Apri ${app.nome} in una nuova scheda`}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* App Details Modal */}
      <AppModal app={selectedApp} onClose={() => setSelectedApp(null)} />
    </div>
  );
};
