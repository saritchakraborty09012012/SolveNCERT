import React from 'react';
import { Radio, LogOut, XCircle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useCollabStore } from '@/store/collabStore';

/**
 * Slim live-status pill: invitees see whose account they are in + Leave.
 * Hosts see how many friends are in + End session.
 */
export default function CollabBanner() {
  const { user } = useAuthStore();
  const { active, role, hostName, members } = useCollabStore();
  if (!active || !user) return null;

  if (role === 'invitee') {
    return (
      <div className="fixed left-1/2 -translate-x-1/2 top-[60px] md:top-[68px] z-[45] flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-600/90 backdrop-blur text-white text-[10px] font-semibold shadow-lg">
        <Radio size={11} className="animate-pulse" />
        <span className="max-w-[200px] truncate">Viewing {hostName}&apos;s account · Live</span>
        <button onClick={() => useCollabStore.getState().leaveSession()}
          className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
          <LogOut size={9} /> Leave
        </button>
      </div>
    );
  }

  const friends = members.filter(m => m.user_id !== user.id).length;
  if (friends === 0) return null;
  return (
    <div className="fixed left-1/2 -translate-x-1/2 top-[60px] md:top-[68px] z-[45] flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-600/90 backdrop-blur text-white text-[10px] font-semibold shadow-lg">
      <Radio size={11} className="animate-pulse" />
      <span>{friends} friend{friends === 1 ? '' : 's'} in your account</span>
      <button onClick={() => useCollabStore.getState().endHosting()}
        className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
        <XCircle size={9} /> End
      </button>
    </div>
  );
}
