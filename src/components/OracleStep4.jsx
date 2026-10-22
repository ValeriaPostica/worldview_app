import { Download, User, BookOpen, Bookmark, Sparkles } from 'lucide-react';
import { Radar } from 'react-chartjs-2';

export default function OracleStep4({ result, exportManuscript, toggleBookmark, setActiveModal, setStep, setResult, setChoices, aiRecommendations }) {
  const getChartData = () => {
    if (!result || !result.radar_scores) return null;
    const scores = result.radar_scores;
    const isWorldviewProfile = scores.creator !== undefined;
    return {
      labels: isWorldviewProfile
        ? ['Universe', 'Meaning', 'Knowledge', 'Morality', 'Society', 'Spirituality', 'Certainty']
        : ['Decisions', 'Learning', 'Meaning', 'Reality', 'Choice'],
      datasets: [
        {
          label: 'Vector',
          data: isWorldviewProfile
            ? [scores.creator, scores.meaning, scores.knowledge, scores.morality, scores.society, scores.spirituality, scores.certainty]
            : [scores.ethics, scores.epistemology, scores.existentialism, scores.metaphysics, scores.agency],
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
    <div id="sacred-dossier" className="space-y-8">
      <div className="flex justify-between items-center border-b border-[#d4af37]/25 pb-2">
        <div><span className="eyebrow">Your result</span><span className="text-sm font-mono uppercase tracking-[0.2em] text-[#d4af37] block">A snapshot of your worldview</span></div>
        <button onClick={exportManuscript} className="inline-flex items-center gap-2 bg-[#17120d] text-[#d4af37] border border-[#d4af37]/50 px-4 py-2 rounded text-sm font-bold uppercase hover:bg-[#d4af37]/20 transition">
          <Download className="w-4 h-4" /> Export Image
        </button>
      </div>

      <div className="text-center space-y-1.5">
        <span className="text-base uppercase tracking-wider text-[#d4af37] font-mono">Your closest worldview</span>
        <h2 className="text-4xl md:text-5xl font-serif text-[#f7f1e3] font-bold">{result.archetype_title}</h2>
        <p className="text-2xl font-mono text-[#d4af37]">{result.worldviewMatches?.[0]?.percentage || 0}% match</p>
        <div className="bg-[#17120d] border border-[#d4af37]/30 p-6 md:p-8 rounded">
          <p className="text-2xl md:text-3xl italic leading-relaxed text-[#f2e8d5]">"{result.philosophical_thesis}"</p>
          {result.examples && <p className="mt-5 text-lg leading-relaxed text-[#c2b59b]">{result.examples}</p>}
          {result.religion && <p className="mt-4 text-base text-[#d4af37]">Closest religious match: <strong>{result.religion}</strong></p>}
        </div>
      </div>

      {result.worldviewMatches && (
        <div className="space-y-3">
          <div className="result-section-title text-[#f3e5ab] font-serif border-b border-[#d4af37]/25 pb-2 font-bold">
            How closely each worldview matches you
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {result.worldviewMatches.map((match) => (
              <div key={match.id} className={`rounded border p-3 ${match.id === result.worldviewId ? 'border-[#d4af37] bg-[#d4af37]/15' : 'border-[#d4af37]/20 bg-[#17120d]'}`}>
                <div className="flex items-center justify-between gap-3">
                  <strong className="text-base text-[#f7f1e3]">{match.title}</strong>
                  <span className="font-mono text-lg text-[#d4af37]">{match.percentage}% match</span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-[#a99b83]">{match.summary}</p>
                <p className="mt-2 text-sm text-[#d4af37]">Closest religious match: {match.religion}</p>
                <p className="mt-2 text-xs uppercase tracking-wider text-[#857762]">Global estimate: {match.population}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-[#857762]">These percentages show how your answers compare with the seven worldview categories. They are a guide, not a diagnosis or a permanent label.</p>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <div className="rounded border border-[#d4af37]/40 bg-[#d4af37]/10 p-5 text-center">
          <span className="block text-sm uppercase tracking-wider text-[#d4af37] font-mono">Estimated share of people</span>
          <strong className="mt-2 block text-3xl text-[#f7f1e3]">{result.population || 'Not available'}</strong>
        </div>
        <p className="rounded border border-[#d4af37]/20 bg-[#17120d] p-5 text-base leading-relaxed text-[#a99b83]">
          {result.populationNote || 'This saved result was created before population estimates were added.'}
        </p>
      </div>

      <div className="p-3 border border-[#d4af37]/30 rounded bg-[#17120d]">
        <h3 className="text-base md:text-lg font-mono uppercase text-center text-[#d4af37] mb-4">Your answer profile</h3>
        <div className="w-full max-w-[420px] mx-auto aspect-square">
          <Radar data={getChartData()} options={{ maintainAspectRatio: true, layout: { padding: 18 }, scales: { r: { angleLines: { color: 'rgba(212, 175, 55, 0.25)' }, grid: { color: 'rgba(212, 175, 55, 0.25)' }, pointLabels: { color: '#f7f1e3', font: { size: 16 } }, ticks: { display: false }, suggestedMin: 0, suggestedMax: 100 } }, plugins: { legend: { display: false } } }} />
        </div>
      </div>

      {result.matching_philosophers.length > 0 && <div className="space-y-3">
        <div className="result-section-title flex items-center gap-2 text-[#f3e5ab] font-serif border-b border-[#d4af37]/25 pb-2 font-bold">
          <User className="w-6 h-6 text-[#d4af37]" /> Thinkers you may connect with
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {result.matching_philosophers.map((p, idx) => (
            <div key={idx} className="bg-[#17120d] border border-[#d4af37]/30 p-3 rounded flex flex-col justify-between space-y-2">
              <div className="space-y-2">
                <div className="w-full max-w-[280px] mx-auto aspect-square rounded overflow-hidden bg-[#14100c] border border-[#d4af37]/30">
                  <img src={p.image_url} alt={p.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-300" />
                </div>
                <div>
                  <h4 className="text-xl font-serif font-bold text-[#f7f1e3]">{p.name}</h4>
                  <span className="text-sm font-mono text-[#d4af37] block">{p.era_or_school}</span>
                </div>
                <p className="text-base leading-relaxed italic text-[#c2b59b]">"{p.key_quote}"</p>
              </div>
              <button onClick={() => setActiveModal({ title: p.name, type: p.era_or_school, summary: p.detailed_summary })} className="w-full bg-[#221b14] hover:bg-[#d4af37]/25 border border-[#d4af37]/40 text-[#d4af37] text-sm py-2 rounded font-mono uppercase">Read more</button>
            </div>
          ))}
        </div>
      </div>}

      {result.recommended_media.length > 0 && <div className="space-y-3">
        <div className="result-section-title flex items-center gap-2 text-[#f3e5ab] font-serif border-b border-[#d4af37]/25 pb-2 font-bold">
          <BookOpen className="w-6 h-6 text-[#d4af37]" /> You might enjoy
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {result.recommended_media.map((m, idx) => (
            <div key={idx} className="bg-[#17120d] border border-[#d4af37]/30 p-3 rounded flex flex-col justify-between space-y-2">
              <div className="space-y-2">
                <div className="w-full max-w-[280px] mx-auto aspect-[3/4] rounded overflow-hidden bg-[#14100c] border border-[#d4af37]/30 relative">
                  <img src={m.cover_url} alt={m.title} className="w-full h-full object-cover" />
                  <button onClick={() => toggleBookmark(m)} className="absolute top-1 right-1 bg-[#17120d] p-1 rounded text-[#d4af37] border border-[#d4af37]/40">
                    <Bookmark className="w-3 h-3" />
                  </button>
                </div>
                <div>
                  <h4 className="text-xl font-serif font-bold text-[#f7f1e3]">{m.title}</h4>
                  <span className="text-sm font-mono text-[#d4af37] block uppercase">{m.type} • {m.dimension_tag}</span>
                </div>
                <p className="text-base leading-relaxed text-[#c2b59b]">{m.short_desc}</p>
              </div>
              <button onClick={() => setActiveModal({ title: m.title, type: `${m.type} • ${m.dimension_tag}`, summary: m.detailed_summary })} className="w-full bg-[#221b14] hover:bg-[#d4af37]/25 border border-[#d4af37]/40 text-[#d4af37] text-sm py-2 rounded font-mono uppercase">Read more</button>
            </div>
          ))}
        </div>
      </div>}

      {aiRecommendations.length > 0 && (
        <div className="space-y-3 ai-result-recommendations">
          <div className="section-label result-section-title"><Sparkles className="w-6 h-6 text-[#d4af37]" /> Based on what you like</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {aiRecommendations.map((item) => <div key={`${item.type}-${item.title}`} className="ai-result-card"><span>{item.type}</span><h4>{item.title}</h4><small>{item.creator}</small><p>{item.reason}</p></div>)}
          </div>
        </div>
      )}

      <button onClick={() => { setStep(1); setResult(null); setChoices({}); }} className="w-full bg-[#17120d] hover:bg-[#2b2118] text-[#f7f1e3] text-xs font-bold py-3 rounded transition border border-[#d4af37]/40 uppercase tracking-[0.2em]">Start over</button>
    </div>
  );
}