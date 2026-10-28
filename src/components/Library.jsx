import { Search, SlidersHorizontal, Compass } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function Library({ database, setActiveModal, onExplore }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const allMedia = database.stoic_rationalist.recommended_media.concat(
    database.existential_absurdist.recommended_media
  );
  const types = ['All', ...new Set(allMedia.map((item) => item.type))];
  const filteredMedia = useMemo(() => allMedia.filter((item) => {
    const matchesType = filter === 'All' || item.type === filter;
    const searchText = `${item.title} ${item.short_desc} ${item.dimension_tag}`.toLowerCase();
    return matchesType && searchText.includes(query.toLowerCase());
  }), [allMedia, filter, query]);

  return (
    <div className="ideas-dashboard">
      <div className="border-b border-[#d4af37]/25 pb-2">
        <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#d4af37]">Ideas to explore</span>
        <h2 className="text-2xl font-serif text-[#f3e5ab] font-bold">A living shelf of ideas</h2>
        <p className="mt-1 text-sm text-[#a99b83]">Books, films, and questions for your next deep dive.</p>
        <button className="explore-ideas-button" onClick={onExplore}><Compass className="w-4 h-4" /> Explore new ideas</button>
      </div>

      <div className="library-tools">
        <label className="library-search"><Search className="w-4 h-4" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search titles, themes, ideas..." /></label>
        <div className="library-filters"><SlidersHorizontal className="w-4 h-4" />{types.map((type) => <button key={type} onClick={() => setFilter(type)} className={filter === type ? 'active' : ''}>{type}</button>)}</div>
      </div>
      <p className="library-count">{filteredMedia.length} {filteredMedia.length === 1 ? 'idea' : 'ideas'} waiting to be discovered</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[480px] overflow-y-auto custom-scrollbar">
        {filteredMedia.map((item, idx) => (
          <div key={idx} className="bg-[#17120d] border border-[#d4af37]/30 rounded p-3 flex flex-col justify-between space-y-2">
            <div className="space-y-1">
              <span className="text-[8px] font-mono text-[#d4af37] uppercase">{item.type} • {item.dimension_tag}</span>
              <h4 className="text-xs font-serif font-bold text-[#f7f1e3]">{item.title}</h4>
              <p className="text-[10px] text-[#c2b59b] italic">{item.short_desc}</p>
            </div>
            <button 
              onClick={() => setActiveModal({ title: item.title, type: item.type, summary: item.detailed_summary })} 
              className="w-full bg-[#221b14] hover:bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40 text-[8px] py-1 rounded font-mono uppercase transition"
            >
              Read more
            </button>
          </div>
        ))}
        {filteredMedia.length === 0 && <p className="empty-note py-10 text-center sm:col-span-2">No ideas found. Try a broader search.</p>}
      </div>
    </div>
  );
}