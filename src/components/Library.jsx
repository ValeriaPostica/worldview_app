export default function Library({ database, setActiveModal }) {
  const allMedia = database.stoic_rationalist.recommended_media.concat(
    database.existential_absurdist.recommended_media
  );

  return (
    <div className="space-y-4">
      <div className="border-b border-[#d4af37]/25 pb-2">
        <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#d4af37]">Ideas to explore</span>
        <h2 className="text-base font-serif text-[#f3e5ab] font-bold">Books, films, and essays</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto custom-scrollbar">
        {allMedia.map((item, idx) => (
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
      </div>
    </div>
  );
}