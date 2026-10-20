import { ArrowRight } from 'lucide-react';

export default function OracleStep1({ media, setMedia, setStep }) {
  return (
    <div className="space-y-5 font-serif">
      <div className="border-b border-[#d4af37]/25 pb-2 flex justify-between items-baseline">
        <div><span className="eyebrow">Step 1 · Your influences</span><h2 className="text-lg md:text-xl text-[#f3e5ab] font-bold">What has shaped the way you think?</h2></div>
        <span className="text-[10px] font-mono text-[#d4af37]/80">1 / 2</span>
      </div>

      <p className="step-lead">There are no right answers. Share the books, films, and ideas you keep coming back to.</p>
      <div className="space-y-3.5 text-xs">
        <div>
          <label className="block text-[10px] uppercase font-bold tracking-wider mb-1 text-[#d4af37]">Books, writers, or thinkers</label>
          <input 
            type="text" 
            placeholder="e.g., Meditations, Crime and Punishment, Plato" 
            value={media.books} 
            onChange={(e) => setMedia({ ...media, books: e.target.value })} 
            className="field w-full bg-[#17120d] border-b border-[#d4af37]/40 py-1.5 px-2 focus:outline-none focus:border-[#d4af37] text-sm text-[#f2e8d5]" 
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase font-bold tracking-wider mb-1 text-[#d4af37]">Films, shows, or visual stories</label>
          <input 
            type="text" 
            placeholder="e.g., The Matrix, Interstellar, Blade Runner 2049" 
            value={media.movies} 
            onChange={(e) => setMedia({ ...media, movies: e.target.value })} 
            className="field w-full bg-[#17120d] border-b border-[#d4af37]/40 py-1.5 px-2 focus:outline-none focus:border-[#d4af37] text-sm text-[#f2e8d5]" 
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase font-bold tracking-wider mb-1 text-[#d4af37]">A quote or idea you like</label>
          <textarea 
            rows={2} 
            placeholder='e.g., "I know that I know nothing."' 
            value={media.quote} 
            onChange={(e) => setMedia({ ...media, quote: e.target.value })} 
            className="field w-full bg-[#17120d] border-b border-[#d4af37]/40 py-1.5 px-2 focus:outline-none focus:border-[#d4af37] text-sm text-[#f2e8d5] resize-none" 
          />
        </div>
      </div>

      <button 
        onClick={() => setStep(2)} 
        className="w-full bg-gradient-to-r from-[#d4af37] via-[#e6c875] to-[#b38f46] text-[#14100c] font-bold py-3 rounded text-xs uppercase tracking-widest flex items-center justify-center gap-1 hover:brightness-110 transition"
      >
        Continue <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}