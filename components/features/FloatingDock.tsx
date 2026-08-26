import React, { useEffect, useState } from 'react';
import AIFloatBubble from './AIFloatBubble';
import ChatFloatBubble from './ChatFloatBubble';

/**
 * FloatingDock — orchestrates AI + Chat bubbles side-by-side,
 * ensures no overlap, proper z-index and mobile spacing.
 * Only one panel can be open at a time.
 */
export default function FloatingDock() {
  const [openPanel, setOpenPanel] = useState<'ai' | 'chat' | null>(null);
  const [aiContext, setAiContext] = useState<{ context: string; prompt: string } | null>(null);
  useEffect(() => { const open = (e: Event) => { setAiContext((e as CustomEvent).detail); setOpenPanel('ai'); }; window.addEventListener('solvencert-ai-context', open); return () => window.removeEventListener('solvencert-ai-context', open); }, []);

  function toggleAI()   { setOpenPanel(p => p === 'ai'   ? null : 'ai');   }
  function toggleChat() { setOpenPanel(p => p === 'chat' ? null : 'chat'); }

  const aiOpen   = openPanel === 'ai';
  const chatOpen = openPanel === 'chat';

  return (
    <>
      {/* Expanded panel — shown above the button row */}
      {(aiOpen || chatOpen) && (
        <div className="fixed bottom-20 sm:bottom-[72px] right-2 sm:right-4 z-50 flex justify-end">
          {aiOpen   && <AIFloatBubble   isOpen={true}  onToggle={toggleAI} initialContext={aiContext} />}
          {chatOpen && <ChatFloatBubble isOpen={true}  onToggle={toggleChat} />}
        </div>
      )}

      {/* Button row — always fixed at bottom-right (chat pill hides while its panel is open) */}
      <div className="fixed bottom-5 right-4 z-50 flex items-center gap-2">
        {!chatOpen && <ChatFloatBubble isOpen={false} onToggle={toggleChat} />}
        <AIFloatBubble   isOpen={false} onToggle={toggleAI}   />
      </div>
    </>
  );
}
