import { Brain, BookOpen, Bookmark, Sparkles } from 'lucide-react';

export default function Header({ tab, setTab }) {
  return (
    <header className="w-full mx-auto relative z-10 py-3 border-b border-[#5e4d2a]/30">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="brand-mark"><Brain className="w-4 h-4" /></div>
          <div>
            <span className="text-sm font-semibold tracking-[0.2em] text-[#f3e5ab] uppercase font-serif block">ALETHEIA</span>
            <span className="brand-subtitle">understand yourself better</span>
          </div>
        </div>

        <nav className="app-nav flex items-center gap-1.5 font-serif text-[11px] uppercase tracking-wider text-[#b89b52]">
          <button 
            onClick={() => setTab('oracle')} 
            className={`px-2.5 py-1 rounded transition ${tab === 'oracle' ? 'bg-[#9a7e3a]/20 text-[#f3e5ab] border border-[#d4af37]/50' : 'hover:text-[#f3e5ab]'}`}
          >
            <Sparkles className="w-3 h-3" /> Explore
          </button>
          <button 
            onClick={() => setTab('dashboard')} 
            className={`px-2.5 py-1 rounded transition ${tab === 'dashboard' ? 'bg-[#9a7e3a]/20 text-[#f3e5ab] border border-[#d4af37]/50' : 'hover:text-[#f3e5ab]'}`}
          >
            <Bookmark className="w-3 h-3" /> Saved
          </button>
          <button 
            onClick={() => setTab('library')} 
            className={`px-2.5 py-1 rounded transition ${tab === 'library' ? 'bg-[#9a7e3a]/20 text-[#f3e5ab] border border-[#d4af37]/50' : 'hover:text-[#f3e5ab]'}`}
          >
            <BookOpen className="w-3 h-3" /> Ideas
          </button>
        </nav>
      </div>
    </header>
  );
}