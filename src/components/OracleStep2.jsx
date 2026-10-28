import { Flame } from 'lucide-react';

export default function OracleStep2({ questions, choices, handleChoice, setStep, calculateWorldview, includeExtraQuestions, setIncludeExtraQuestions }) {
  const answered = Object.keys(choices).length;
  return (
    <div className="space-y-6">
      <div className="border-b border-[#d4af37]/25 pb-1.5 flex justify-between items-baseline">
        <div><span className="eyebrow">Step 2 · Your point of view</span><h2 className="text-3xl md:text-4xl text-[#f3e5ab] font-bold">What feels most true to you?</h2></div>
        <span className="text-sm font-mono text-[#d4af37]/80">2 / 2</span>
      </div>

      <div className="question-progress" aria-label={`${answered} of ${questions.length} questions answered`}>
        <div><span>Reflection progress</span><strong>{answered}/{questions.length}</strong></div>
        <div className="question-progress-track"><span style={{ width: `${(answered / questions.length) * 100}%` }} /></div>
      </div>
      <p className="step-lead">Choose the answer that feels closest to you. There are no right or wrong answers.</p>
      <div className="space-y-4 pr-1">
        {questions.map((q) => (
          <div key={q.id} className="p-5 md:p-6 bg-[#17120d] rounded border border-[#d4af37]/25 space-y-3">
            <span className="text-base md:text-lg font-mono tracking-widest text-[#d4af37] uppercase font-bold">{q.category}</span>
            <p className="text-[1.625rem] md:text-[2rem] leading-relaxed font-serif italic text-[#f2e8d5]">{q.question}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {q.options.map((option) => (
                <button
                  key={option.text}
                  onClick={() => handleChoice(q.id, option.tags)}
                  className={`choice-card p-5 text-left rounded text-xl md:text-2xl border font-serif transition ${JSON.stringify(choices[q.id]) === JSON.stringify(option.tags) ? 'selected bg-[#d4af37]/30 border-[#d4af37] text-[#f7f1e3] font-bold' : 'bg-[#221b14] border-[#382b20] text-[#c2b59b] hover:border-[#d4af37]/50'}`}
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {!includeExtraQuestions && (
        <button className="more-questions-button" onClick={() => setIncludeExtraQuestions(true)}>
          I want more questions <span>+3</span>
        </button>
      )}
      <div className="flex gap-2">
        <button 
          onClick={() => setStep(1)} 
          className="w-1/4 bg-[#17120d] text-[#c2b59b] text-lg font-bold py-5 rounded border border-[#382b20] uppercase hover:bg-[#282018] transition"
        >
          Back
        </button>
        <button 
          onClick={calculateWorldview} 
          disabled={Object.keys(choices).length < questions.length} 
          className={`w-3/4 py-5 rounded text-lg font-bold uppercase tracking-widest transition flex items-center justify-center gap-2 ${Object.keys(choices).length >= questions.length ? 'bg-gradient-to-r from-[#d4af37] via-[#e6c875] to-[#b38f46] text-[#14100c]' : 'bg-[#2b2118] text-[#6e614d] border border-[#382b20] cursor-not-allowed'}`}
        >
          <Flame className="w-5 h-5" /> Show my result
        </button>
      </div>
    </div>
  );
}