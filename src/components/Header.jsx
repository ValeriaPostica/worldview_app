import { Brain, BookOpen, Bookmark, Compass } from 'lucide-react';

export default function Header({ tab, setTab, onHome, savedProfiles = 0, savedItems = 0 }) {
  return (
    <header className="w-full mx-auto relative z-10 py-3 border-b border-[#5e4d2a]/30">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <button className="flex items-center gap-2 brand-home" onClick={onHome} aria-label="Go to Aletheia home">
          <div className="brand-mark"><Brain className="w-4 h-4" /></div>
          <div>
            <span className="text-sm font-semibold tracking-[0.2em] text-[#f3e5ab] uppercase font-serif block">ALETHEIA</span>
            <span className="brand-subtitle">understand yourself better</span>
          </div>
        </button>

        <nav className="app-nav flex items-center gap-1.5 font-serif text-[11px] uppercase tracking-wider text-[#b89b52]">
          <button 
            onClick={() => setTab('oracle')} 
            className={`px-2.5 py-1 rounded transition ${tab === 'oracle' ? 'bg-[#9a7e3a]/20 text-[#f3e5ab] border border-[#d4af37]/50' : 'hover:text-[#f3e5ab]'}`}
          >
            <Compass className="w-3 h-3" /> Explore
          </button>
          <button 
            onClick={() => setTab('dashboard')} 
            className={`px-2.5 py-1 rounded transition ${tab === 'dashboard' ? 'bg-[#9a7e3a]/20 text-[#f3e5ab] border border-[#d4af37]/50' : 'hover:text-[#f3e5ab]'}`}
          >
            <Bookmark className="w-3 h-3" />             Saved {savedProfiles + savedItems > 0 && <span className="nav-count">{savedProfiles + savedItems}</span>}
          </button>
          <button 
            onClick={() => setTab('library')} 
            className={`px-2.5 py-1 rounded transition ${tab === 'library' || tab === 'universe' ? 'bg-[#9a7e3a]/20 text-[#f3e5ab] border border-[#d4af37]/50' : 'hover:text-[#f3e5ab]'}`}
          >
            <BookOpen className="w-3 h-3" /> Ideas
          </button>
        </nav>
      </div>
    </header>
  );
}