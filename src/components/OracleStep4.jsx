import { Download, User, BookOpen, Bookmark, Sparkles } from 'lucide-react';
import { Radar } from 'react-chartjs-2';

export default function OracleStep4({ result, exportManuscript, toggleBookmark, setActiveModal, setStep, setResult, setChoices, aiRecommendations }) {
  const getChartData = () => {
    if (!result || !result.radar_scores) return null;
    const scores = result.radar_scores;
    return {
      labels: ['Decisions', 'Learning', 'Meaning', 'Reality', 'Choice'],
      datasets: [
        {
          label: 'Vector',
          data: [scores.ethics, scores.epistemology, scores.existentialism, scores.metaphysics, scores.agency],
          backgroundColor: 'rgba(212, 175, 55, 0.25)',
          borderColor: '#d4af37',
          borderWidth: 2,
          pointBackgroundColor: '#f7f1e3',
          pointBorderColor: '#d4af37',
        },
      ],
    };
  };

  return (
    <div id="sacred-dossier" className="space-y-6 max-h-[480px] overflow-y-auto custom-scrollbar">
      <div className="flex justify-between items-center border-b border-[#d4af37]/25 pb-2">
        <div><span className="eyebrow">Your result</span><span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#d4af37] block">A snapshot of your view</span></div>
        <button onClick={exportManuscript} className="inline-flex items-center gap-1 bg-[#17120d] text-[#d4af37] border border-[#d4af37]/50 px-2.5 py-1 rounded text-[9px] font-bold uppercase hover:bg-[#d4af37]/20 transition">
          <Download className="w-3 h-3" /> Export Image
        </button>
      </div>

      <div className="text-center space-y-1.5">
        <span className="text-[8px] uppercase tracking-wider text-[#d4af37] font-mono">Your thinking style</span>
        <h2 className="text-2xl md:text-3xl font-serif text-[#f7f1e3] font-bold">{result.archetype_title}</h2>
        <div className="bg-[#17120d] border border-[#d4af37]/30 p-3.5 rounded">
          <p className="text-xs italic leading-relaxed text-[#f2e8d5]">"{result.philosophical_thesis}"</p>
        </div>
      </div>

      <div className="p-3 border border-[#d4af37]/30 rounded bg-[#17120d]">
        <h3 className="text-[9px] font-mono uppercase text-center text-[#d4af37] mb-1">Your answer profile</h3>
        <div className="max-w-[200px] mx-auto aspect-square">
          <Radar data={getChartData()} options={{ scales: { r: { angleLines: { color: 'rgba(212, 175, 55, 0.25)' }, grid: { color: 'rgba(212, 175, 55, 0.25)' }, pointLabels: { color: '#f7f1e3', font: { size: 9 } }, ticks: { display: false }, suggestedMin: 0, suggestedMax: 100 } }, plugins: { legend: { display: false } } }} />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-1.5 text-[#f3e5ab] font-serif border-b border-[#d4af37]/25 pb-1 text-sm font-bold">
          <User className="w-4 h-4 text-[#d4af37]" /> Thinkers you may connect with
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {result.matching_philosophers.map((p, idx) => (
            <div key={idx} className="bg-[#17120d] border border-[#d4af37]/30 p-3 rounded flex flex-col justify-between space-y-2">
              <div className="space-y-2">
                <div className="aspect-square rounded overflow-hidden bg-[#14100c] border border-[#d4af37]/30">
                  <img src={p.image_url} alt={p.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-300" />
                </div>
                <div>
                  <h4 className="text-xs font-serif font-bold text-[#f7f1e3]">{p.name}</h4>
                  <span className="text-[8px] font-mono text-[#d4af37] block">{p.era_or_school}</span>
                </div>
                <p className="text-[9px] italic text-[#c2b59b]">"{p.key_quote}"</p>
              </div>
              <button onClick={() => setActiveModal({ title: p.name, type: p.era_or_school, summary: p.detailed_summary })} className="w-full bg-[#221b14] hover:bg-[#d4af37]/25 border border-[#d4af37]/40 text-[#d4af37] text-[9px] py-1 rounded font-mono uppercase">              Read more</button>
            </div>
          ))}
        </div>
      </div>

      {aiRecommendations.length > 0 && (
        <div className="space-y-3 ai-result-recommendations">
          <div className="section-label"><Sparkles className="w-4 h-4 text-[#d4af37]" /> More ideas based on your interests</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {aiRecommendations.map((item) => <div key={`${item.type}-${item.title}`} className="ai-result-card"><span>{item.type}</span><h4>{item.title}</h4><small>{item.creator}</small><p>{item.reason}</p></div>)}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center gap-1.5 text-[#f3e5ab] font-serif border-b border-[#d4af37]/25 pb-1 text-sm font-bold">
          <BookOpen className="w-4 h-4 text-[#d4af37]" /> You might enjoy
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {result.recommended_media.map((m, idx) => (
            <div key={idx} className="bg-[#17120d] border border-[#d4af37]/30 p-3 rounded flex flex-col justify-between space-y-2">
              <div className="space-y-2">
                <div className="aspect-[3/4] rounded overflow-hidden bg-[#14100c] border border-[#d4af37]/30 relative">
                  <img src={m.cover_url} alt={m.title} className="w-full h-full object-cover" />
                  <button onClick={() => toggleBookmark(m)} className="absolute top-1 right-1 bg-[#17120d] p-1 rounded text-[#d4af37] border border-[#d4af37]/40">
                    <Bookmark className="w-3 h-3" />
                  </button>
                </div>
                <div>
                  <h4 className="text-xs font-serif font-bold text-[#f7f1e3] line-clamp-1">{m.title}</h4>
                  <span className="text-[8px] font-mono text-[#d4af37] block uppercase">{m.type} • {m.dimension_tag}</span>
                </div>
                <p className="text-[9px] text-[#c2b59b] line-clamp-2">{m.short_desc}</p>
              </div>
              <button onClick={() => setActiveModal({ title: m.title, type: `${m.type} • ${m.dimension_tag}`, summary: m.detailed_summary })} className="w-full bg-[#221b14] hover:bg-[#d4af37]/25 border border-[#d4af37]/40 text-[#d4af37] text-[9px] py-1 rounded font-mono uppercase">              Read more</button>
            </div>
          ))}
        </div>
      </div>

      <button onClick={() => { setStep(1); setResult(null); setChoices({}); }} className="w-full bg-[#17120d] hover:bg-[#2b2118] text-[#f7f1e3] text-xs font-bold py-3 rounded transition border border-[#d4af37]/40 uppercase tracking-[0.2em]">Start over</button>
    </div>
  );
}