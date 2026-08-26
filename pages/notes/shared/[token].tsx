import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Loader2, BookOpen } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import NotesViewer from '@/components/features/NotesViewer';
import { supabase } from '@/lib/supabase';
import type { GeneratedNote, NotesData } from '@/types/database';

export default function SharedNotesPage() {
  const router = useRouter();
  const { token } = router.query;
  const [note, setNote] = useState<GeneratedNote | null>(null);
  const [notesData, setNotesData] = useState<NotesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    async function load() {
      const { data } = await supabase
        .from('generated_notes')
        .select('*')
        .eq('share_token', token)
        .eq('is_public', true)
        .single();
      if (data) {
        setNote(data);
        setNotesData({
          title: data.chapter,
          pages: data.pages as unknown as NotesData['pages'],
        });
      } else {
        setError('Notes not found or no longer shared.');
      }
      setLoading(false);
    }
    load();
  }, [token]);

  return (
    <Layout
      title={note ? `${note.chapter} | Shared Notes` : 'Shared Notes'}
      description={`Notes for ${note?.chapter || 'NCERT chapter'} shared on SolveNCERT`}
      canonical={token ? `/notes/shared/${token}` : '/notes'}
    >
      <div className="max-w-screen-lg mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={28} className="animate-spin text-blue-500" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <BookOpen size={40} className="mx-auto text-[var(--text-muted)] mb-4 opacity-40" />
            <p className="text-[var(--text-muted)]">{error}</p>
          </div>
        ) : notesData ? (
          <>
            <div className="text-center mb-4">
              <p className="text-xs text-[var(--text-muted)]">
                Shared by a SolveNCERT user &middot; {note?.subject} &middot; {note?.book}
              </p>
            </div>
            <NotesViewer notes={notesData} />
          </>
        ) : null}
      </div>
    </Layout>
  );
}
