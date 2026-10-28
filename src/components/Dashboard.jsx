import { Trash2, Bookmark, ArrowUpRight, Lightbulb, History } from 'lucide-react';

export default function Dashboard({ savedProfiles, deleteProfile, savedItems = [], setResult, setStep, setTab, setActiveModal }) {
  return (
    <div className="saved-dashboard">
      <div className="dashboard-heading">
        <div><span className="eyebrow">Your space</span><h2>Saved thoughts</h2><p>Return to the ideas that stayed with you.</p></div>
        <Lightbulb className="dashboard-heading-icon" />
      </div>

      <div className="folio-stats">
        <div><strong>{savedProfiles.length}</strong><span>evaluations</span></div>
        <div><strong>{savedItems.length}</strong><span>bookmarks</span></div>
        <div><strong>5</strong><span>dimensions</span></div>
      </div>

      <div className="dashboard-section-title"><History className="w-4 h-4" /> Reflection history</div>
      {savedProfiles.length === 0 ? (
        <div className="text-center py-12 space-y-2">
          <p className="text-xs text-[#c2b59b] italic">No prior evaluations saved yet.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[380px] overflow-y-auto custom-scrollbar">
          {savedProfiles.map((prof) => (
            <div key={prof.id} className="bg-[#17120d] border border-[#d4af37]/30 rounded p-3 space-y-1.5">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[8px] font-mono text-[#d4af37]">{prof.date}</span>
                  <h4 className="text-xs font-serif font-bold text-[#f7f1e3]">{prof.data.archetype_title}</h4>
                </div>
                <button onClick={() => deleteProfile(prof.id)} className="text-rose-400 p-1 hover:text-rose-300">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[10px] italic text-[#c2b59b]">"{prof.data.philosophical_thesis}"</p>
              <button 
                onClick={() => { setResult(prof.data); setStep(4); setTab('oracle'); }} 
                className="bg-[#221b14] hover:bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40 text-[9px] px-2 py-1 rounded font-mono uppercase transition"
              >
                View result
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="dashboard-section">
        <div className="dashboard-section-title"><Bookmark className="w-4 h-4" /> Saved ideas</div>
        {savedItems.length === 0 ? (
          <p className="empty-note">Save a book, film, or essay from your result and it will appear here.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {savedItems.map((item) => (
              <button key={item.title} onClick={() => setActiveModal({ title: item.title, type: item.type, summary: item.detailed_summary })} className="bookmark-row">
                <span><strong>{item.title}</strong><small>{item.type} · {item.dimension_tag}</small></span><ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}