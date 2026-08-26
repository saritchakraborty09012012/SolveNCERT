import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useCollabStore, isMemberOnline } from '@/store/collabStore';
import { getInitialsColor } from '@/utils/helpers';

/**
 * Presence bubbles — top-right, below the header.
 * Host sees each invitee's initials bubble (click → name only).
 * Invitees also see the host's bubble, labelled "name (host)".
 * Bubbles vanish when the person leaves or after 24h of inactivity.
 */
export default function CollabPresenceBar() {
  const { user } = useAuthStore();
  const { active, members, role } = useCollabStore();
  const [openId, setOpenId] = useState<string | null>(null);

  if (!active || !user) return null;
  const others = members.filter(m => m.user_id !== user.id);
  if (others.length === 0) return null;

  return (
    <div className="fixed right-3 top-[60px] md:top-[68px] z-[45] flex items-center gap-1.5">
      {others.map(m => {
        const initials = m.display_name.slice(0, 2).toUpperCase();
        const colors = getInitialsColor(initials);
        const online = isMemberOnline(m.last_seen_at);
        const label = m.is_host ? `${m.display_name} (host)` : m.display_name;
        return (
          <div key={m.id} className="relative">
            <button
              onClick={() => setOpenId(openId === m.id ? null : m.id)}
              title={role === 'host' ? 'Who is here?' : undefined}
              className="relative w-9 h-9 rounded-full grid place-items-center text-[10px] font-bold text-white shadow-lg border-2 border-[var(--surface-0)] transition-transform hover:scale-110"
              style={{ background: colors.fg }}
            >
              {initials}
              <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[var(--surface-0)] ${online ? 'bg-emerald-500' : 'bg-gray-400'}`} />
            </button>
            {openId === m.id && (
              <div className="absolute right-0 top-11 w-max max-w-[180px] rounded-xl border border-[var(--border)] bg-[var(--surface-0)] shadow-2xl px-3 py-2">
                <button onClick={() => setOpenId(null)} className="absolute top-1.5 right-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                  <X size={11} />
                </button>
                <p className="text-xs font-semibold text-[var(--text-primary)] pr-4 truncate">{label}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
