import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const router = useRouter();
  const { fetchProfile } = useAuthStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user.id).then(() => router.replace('/'));
      } else {
        router.replace('/');
      }
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--surface-1)]">
      <div className="text-center">
        <Loader2 size={28} className="animate-spin text-blue-500 mx-auto mb-3" />
        <p className="text-sm text-[var(--text-muted)]">Signing you in...</p>
      </div>
    </div>
  );
}
