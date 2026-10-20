import { X } from 'lucide-react';

export default function Modal({ activeModal, setActiveModal }) {
  if (!activeModal) return null;

  return (
    <div className="fixed inset-0 bg-[#070709]/90 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-[#221b14] border-2 border-[#d4af37]/50 max-w-md w-full rounded p-5 space-y-4 shadow-2xl relative max-h-[85vh] overflow-y-auto">
        <button 
          onClick={() => setActiveModal(null)} 
          className="absolute top-4 right-4 text-[#c2b59b] hover:text-[#d4af37] p-1 rounded-full bg-[#17120d]"
        >
          <X className="w-4 h-4" />
        </button>

        <div>
          <span className="text-[9px] font-mono text-[#d4af37] uppercase tracking-wider">{activeModal.type}</span>
          <h3 className="text-lg font-serif font-bold text-[#f3e5ab]">{activeModal.title}</h3>
        </div>

        <div className="border-t border-[#d4af37]/25 pt-3 text-xs text-[#f2e8d5] leading-relaxed font-serif whitespace-pre-line">
          {activeModal.summary}
        </div>

        <button 
          onClick={() => setActiveModal(null)} 
          className="w-full bg-[#17120d] text-[#d4af37] border border-[#d4af37]/40 text-xs py-2 rounded font-mono uppercase hover:bg-[#221b14] transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}