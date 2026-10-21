import { X } from 'lucide-react';

export default function Modal({ activeModal, setActiveModal }) {
  if (!activeModal) return null;

  return (
    <div className="fixed inset-0 bg-[#070709]/90 backdrop-blur-md flex items-center justify-center p-3 md:p-6 z-50">
      <div className="bg-[#221b14] border-2 border-[#d4af37]/50 max-w-3xl w-full min-h-[50vh] rounded p-6 md:p-10 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button 
          onClick={() => setActiveModal(null)} 
          className="absolute top-4 right-4 text-[#c2b59b] hover:text-[#d4af37] p-1 rounded-full bg-[#17120d]"
        >
          <X className="w-6 h-6" />
        </button>

        <div>
          <span className="text-sm md:text-base font-mono text-[#d4af37] uppercase tracking-wider">{activeModal.type}</span>
          <h3 className="text-3xl md:text-4xl font-serif font-bold text-[#f3e5ab] pr-10">{activeModal.title}</h3>
        </div>

        <div className="border-t border-[#d4af37]/25 pt-6 text-lg md:text-xl text-[#f2e8d5] leading-relaxed font-serif whitespace-pre-line">
          {activeModal.summary}
        </div>

        <button 
          onClick={() => setActiveModal(null)} 
          className="w-full bg-[#17120d] text-[#d4af37] border border-[#d4af37]/40 text-base py-4 rounded font-mono uppercase hover:bg-[#221b14] transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}