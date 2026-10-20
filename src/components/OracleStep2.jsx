import { Flame } from 'lucide-react';

export default function OracleStep2({ questions, choices, handleChoice, setStep, calculateWorldview, aiRecommendations, aiLoading, aiError }) {
  return (
    <div className="space-y-3.5">
      <div className="border-b border-[#d4af37]/25 pb-1.5 flex justify-between items-baseline">
        <div><span className="eyebrow">Step 2 · Your point of view</span><h2 className="text-lg text-[#f3e5ab] font-bold">What feels most true to you?</h2></div>
        <span className="text-[10px] font-mono text-[#d4af37]/80">2 / 2</span>
      </div>

      <p className="step-lead">Pick the answer that feels closest to your honest view right now. You can change your mind later.</p>
      {aiLoading && <div className="ai-inline-status"><span className="ai-status-dot" /> Finding a few things you might like...</div>}
      {aiError && <p className="ai-inline-error">{aiError}</p>}
      {aiRecommendations.length > 0 && (
        <div className="ai-recommendation-strip">
          <div className="section-label">Based on what you like</div>
          <div className="ai-recommendation-list">
            {aiRecommendations.map((item) => <div key={`${item.type}-${item.title}`}><strong>{item.title}</strong><small>{item.type} · {item.creator}</small><p>{item.reason}</p></div>)}
          </div>
        </div>
      )}
      <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1 custom-scrollbar">
        {questions.map((q) => (
          <div key={q.id} className="p-3 bg-[#17120d] rounded border border-[#d4af37]/25 space-y-1.5">
            <span className="text-[8px] font-mono tracking-widest text-[#d4af37] uppercase font-bold">{q.category}</span>
            <p className="text-xs font-serif italic text-[#f2e8d5]">{q.question}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button 
                onClick={() => handleChoice(q.id, q.a)} 
                className={`choice-card p-2.5 text-left rounded text-xs border font-serif transition flex flex-col justify-between ${choices[q.id] === q.a ? 'selected bg-[#d4af37]/30 border-[#d4af37] text-[#f7f1e3] font-bold' : 'bg-[#221b14] border-[#382b20] text-[#c2b59b] hover:border-[#d4af37]/50'}`}
              >
                <span>{q.a}</span>
                <span className="text-[8px] text-[#d4af37] uppercase font-mono mt-1">{q.termA}</span>
              </button>
              <button 
                onClick={() => handleChoice(q.id, q.b)} 
                className={`choice-card p-2.5 text-left rounded text-xs border font-serif transition flex flex-col justify-between ${choices[q.id] === q.b ? 'selected bg-[#d4af37]/30 border-[#d4af37] text-[#f7f1e3] font-bold' : 'bg-[#221b14] border-[#382b20] text-[#c2b59b] hover:border-[#d4af37]/50'}`}
              >
                <span>{q.b}</span>
                <span className="text-[8px] text-[#d4af37] uppercase font-mono mt-1">{q.termB}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button 
          onClick={() => setStep(1)} 
          className="w-1/4 bg-[#17120d] text-[#c2b59b] text-xs font-bold py-2.5 rounded border border-[#382b20] uppercase hover:bg-[#282018] transition"
        >
          Back
        </button>
        <button 
          onClick={calculateWorldview} 
          disabled={Object.keys(choices).length < 3} 
          className={`w-3/4 py-2.5 rounded text-xs font-bold uppercase tracking-widest transition flex items-center justify-center gap-1.5 ${Object.keys(choices).length >= 3 ? 'bg-gradient-to-r from-[#d4af37] via-[#e6c875] to-[#b38f46] text-[#14100c]' : 'bg-[#2b2118] text-[#6e614d] border border-[#382b20] cursor-not-allowed'}`}
        >
          <Flame className="w-3.5 h-3.5" /> Show my result
        </button>
      </div>
    </div>
  );
}