import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Pen, Square, Circle as CircleIcon, Type, Trash2,
  Download, Users, MessageCircle, X, Send, Loader2,
  Minus, Eraser, RotateCcw, ChevronRight, Copy, Plus, LogIn
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import AutoGrowTextarea from '@/components/features/AutoGrowTextarea';
import AIFollowUp from '@/components/features/AIFollowUp';
import { useAuthStore } from '@/store/authStore';
import { useCollabStore } from '@/store/collabStore';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { cn } from '@/utils/helpers';
import toast from 'react-hot-toast';

type Tool  = 'pen' | 'marker' | 'pencil' | 'eraser' | 'line' | 'rect' | 'circle' | 'text';
type Color = string;

interface BoardStrokeLive {
  id: string;
  author_id: string;
  author_name: string;
  tool: string;
  color: string;
  size: number;
  alpha: number;
  points: { x: number; y: number }[];
  text_content: string | null;
}

const COLORS: Color[] = [
  '#1e3a8a','#3478f6','#7c3aed','#be123c','#065f46',
  '#92400e','#374151','#000000','#ef4444','#f59e0b',
  '#22c55e','#06b6d4','#ffffff',
];

const TOOLS: { id: Tool; icon: React.ElementType; label: string }[] = [
  { id: 'pen',     icon: Pen,         label: 'Pen'     },
  { id: 'marker',  icon: Pen,         label: 'Marker'  },
  { id: 'pencil',  icon: Pen,         label: 'Pencil'  },
  { id: 'eraser',  icon: Eraser,      label: 'Eraser'  },
  { id: 'line',    icon: Minus,       label: 'Line'    },
  { id: 'rect',    icon: Square,      label: 'Rectangle'},
  { id: 'circle',  icon: CircleIcon,  label: 'Circle'  },
  { id: 'text',    icon: Type,        label: 'Text'    },
];

interface ChatMessage { id: string; user: string; text: string; time: string; }

export default function StudyRoomPage() {
  const { user, isGuest } = useAuthStore();
  const router = useRouter();
  const code = typeof router.query.code === 'string' ? router.query.code : undefined;

  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const [tool,       setTool]       = useState<Tool>('pen');
  const [color,      setColor]      = useState('#3478f6');
  const [size,       setSize]       = useState(3);
  const [drawing,    setDrawing]    = useState(false);
  const [chatOpen,   setChatOpen]   = useState(false);
  const [message,    setMessage]    = useState('');
  const [messages,   setMessages]   = useState<ChatMessage[]>([
    { id: '1', user: 'System', text: 'Study Room created. Invite friends to collaborate!', time: new Date().toLocaleTimeString() },
  ]);
  const [history,    setHistory]    = useState<ImageData[]>([]);
  const lastPt = useRef<{ x: number; y: number } | null>(null);
  const chatBottom = useRef<HTMLDivElement>(null);

  // ── Room lobby (create / join) state ──────────────────────────────────
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [creatingRoom,  setCreatingRoom]  = useState(false);
  const [joiningRoom,   setJoiningRoom]   = useState(false);

  // ── Collaboration board (persistent, multi-user, author-tagged) ────────
  const collabActive   = useCollabStore((s) => s.active);
  const collabSession  = useCollabStore((s) => s.sessionId);
  const collabRole     = useCollabStore((s) => s.role);
  const collabHostId   = useCollabStore((s) => s.hostId);
  const collabMembers  = useCollabStore((s) => s.members);
  const collabHostName = useCollabStore((s) => s.hostName);
  const collabMode     = collabActive && !!collabSession;
  const strokesRef     = useRef<BoardStrokeLive[]>([]);
  const liveStrokeRef  = useRef<BoardStrokeLive | null>(null);
  const [boardVersion, setBoardVersion] = useState(0);   // bumps → AI context refreshes

  // ── Live room state ────────────────────────────────────────────────────
  const [roomStatus,   setRoomStatus]   = useState<'checking' | 'ready' | 'not-found'>('checking');
  const [maxMembers,   setMaxMembers]   = useState(5);
  const [participants, setParticipants] = useState<{ name: string }[]>([]);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (isGuest) { router.replace('/'); return; }
    initCanvas();
  }, [isGuest]);

  useEffect(() => {
    if (roomStatus === 'ready') initCanvas();
  }, [roomStatus]);

  useEffect(() => {
    chatBottom.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Verify the room exists, then open a Realtime channel for it (presence + broadcast)
  useEffect(() => {
    if (!code || !user) return;
    let cancelled = false;
    setRoomStatus('checking');

    (async () => {
      const { data } = await supabase.from('study_sessions').select('*').eq('code', code).eq('is_active', true).maybeSingle();
      if (cancelled) return;
      if (!data) { setRoomStatus('not-found'); return; }
      setMaxMembers(data.max_members || 5);
      setRoomStatus('ready');

      const channel = supabase.channel(`study-room-${code}`, { config: { presence: { key: user.id } } });
      channelRef.current = channel;

      channel
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState<{ name: string }>();
          setParticipants(Object.values(state).flat());
        })
        .on('broadcast', { event: 'draw' }, ({ payload }) => applyRemoteStroke(payload))
        .on('broadcast', { event: 'clear' }, () => clearCanvas(false))
        .on('broadcast', { event: 'chat' }, ({ payload }) => setMessages(prev => [...prev, payload]))
        .subscribe(async status => {
          if (status === 'SUBSCRIBED') {
            await channel.track({ name: user.full_name || 'Student' });
          }
        });
    })();

    return () => {
      cancelled = true;
      channelRef.current?.unsubscribe();
      channelRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, user?.id]);

  async function createRoom() {
    if (!user) return;
    setCreatingRoom(true);
    try {
      const newCode = Math.random().toString(36).slice(2, 8).toUpperCase();
      const cap = user.plan === 'premium' ? 10 : 5;
      const { error } = await supabase.from('study_sessions').insert({
        host_id: user.id,
        title: `${user.full_name || 'Student'}'s Study Room`,
        code: newCode,
        invite_link: `${window.location.origin}/study-room?code=${newCode}`,
        max_members: cap,
        expires_at: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
      });
      if (error) throw error;
      router.push(`/study-room?code=${newCode}`);
    } catch {
      toast.error('Could not create room — try again.');
    } finally {
      setCreatingRoom(false);
    }
  }

  async function joinRoom() {
    const target = joinCodeInput.trim().toUpperCase();
    if (!target) return;
    setJoiningRoom(true);
    try {
      const { data } = await supabase.from('study_sessions').select('code').eq('code', target).eq('is_active', true).maybeSingle();
      if (!data) { toast.error('Room not found or expired.'); return; }
      router.push(`/study-room?code=${target}`);
    } finally {
      setJoiningRoom(false);
    }
  }

  function copyInviteLink() {
    if (!code) return;
    navigator.clipboard.writeText(`${window.location.origin}/study-room?code=${code}`);
    toast.success('Invite link copied!');
  }

  function applyRemoteStroke(payload: any) {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !payload) return;
    ctx.strokeStyle = payload.color;
    ctx.lineWidth = payload.lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = payload.alpha ?? 1;
    ctx.beginPath();
    ctx.moveTo(payload.x0, payload.y0);
    ctx.lineTo(payload.x1, payload.y1);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  function initCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function getPos(e: React.MouseEvent | React.TouchEvent) {
    const canvas = canvasRef.current!;
    const rect   = canvas.getBoundingClientRect();
    const src    = 'touches' in e ? e.touches[0] : e;
    return { x: src.clientX - rect.left, y: src.clientY - rect.top };
  }

  function startDraw(e: React.MouseEvent | React.TouchEvent) {
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext('2d')!;
    const pos = getPos(e);

    // ── Collab board: eraser removes strokes; text tool prompts ───────────
    if (collabMode) {
      if (tool === 'eraser') { eraseBoardAt(pos); return; }
      if (tool === 'text') {
        const u = useAuthStore.getState().user;
        const text = window.prompt('Type to write on the board:');
        if (!text?.trim() || !u || !collabSession) return;
        const row = {
          session_id: collabSession, author_id: u.id,
          author_name: u.full_name || 'Friend', tool: 'text', color,
          size, alpha: 1, points: [{ x: pos.x / canvas.width, y: pos.y / canvas.height }],
          text_content: text.trim(),
        };
        supabase.from('collab_board_strokes').insert(row).then(() => {}, () => toast.error('Could not write.'));
        return;
      }
      liveStrokeRef.current = {
        id: crypto.randomUUID(), author_id: useAuthStore.getState().user?.id || '',
        author_name: useAuthStore.getState().user?.full_name || 'Friend',
        tool, color, size, alpha: strokeAlphaFor(tool),
        points: [{ x: pos.x / canvas.width, y: pos.y / canvas.height }], text_content: null,
      };
      setDrawing(true);
      lastPt.current = pos;
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      return;
    }

    // Save state for undo
    setHistory(prev => [...prev.slice(-19), ctx.getImageData(0, 0, canvas.width, canvas.height)]);
    lastPt.current = pos;
    setDrawing(true);

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  }

  function draw(e: React.MouseEvent | React.TouchEvent) {
    if (!drawing || !lastPt.current) return;
    e.preventDefault();
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext('2d')!;
    const pos    = getPos(e);

    const strokeColor = tool === 'eraser' ? '#ffffff' : color;
    const lineWidth   = tool === 'marker' ? size * 4 : tool === 'eraser' ? size * 6 : size;
    const alpha       = tool === 'marker' ? 0.5 : tool === 'pencil' ? 0.7 : 1;

    // ── Collab board: accumulate + broadcast live ──────────────────────────
    if (collabMode && liveStrokeRef.current) {
      const s = liveStrokeRef.current;
      s.points.push({ x: pos.x / canvas.width, y: pos.y / canvas.height });
      const n = s.points.length;
      drawStrokeSegment(s, n - 2, n - 1);
      useCollabStore.getState().channel?.send({
        type: 'broadcast', event: 'board-live',
        payload: { id: s.id, author_name: s.author_name, color: s.color, lineWidth: s.size, alpha: s.alpha, x0: lastPt.current.x / canvas.width, y0: lastPt.current.y / canvas.height, x1: pos.x / canvas.width, y1: pos.y / canvas.height },
      });
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      lastPt.current = pos;
      return;
    }

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth   = lineWidth;
    ctx.lineCap     = 'round';
    ctx.lineJoin    = 'round';
    ctx.globalAlpha = alpha;

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    // Sync this stroke segment to everyone else in the room (no-op if not in a live room)
    channelRef.current?.send({
      type: 'broadcast', event: 'draw',
      payload: { x0: lastPt.current.x, y0: lastPt.current.y, x1: pos.x, y1: pos.y, color: strokeColor, lineWidth, alpha },
    });

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    lastPt.current = pos;
  }

  function stopDraw() {
    const canvas = canvasRef.current;
    const ctx    = canvas?.getContext('2d');
    if (ctx) ctx.globalAlpha = 1;

    // ── Collab board: persist the finished stroke ──────────────────────────
    if (collabMode && liveStrokeRef.current) {
      const s = liveStrokeRef.current;
      liveStrokeRef.current = null;
      if (s.points.length >= 2 && collabSession) {
        supabase.from('collab_board_strokes').insert({
          session_id: collabSession, author_id: s.author_id, author_name: s.author_name,
          tool: s.tool, color: s.color, size: s.size, alpha: s.alpha,
          points: s.points, text_content: null,
        }).then(({ error }) => {
          if (error) { toast.error('Could not save your drawing.'); return; }
          strokesRef.current.push(s);
          drawAuthorTag(s);
          setBoardVersion(v => v + 1);
        }, () => {});
      }
      setDrawing(false);
      lastPt.current = null;
      return;
    }

    setDrawing(false);
    lastPt.current = null;
  }

  // ── Collaboration board helpers (persistent, author-tagged) ────────────
  function authorColor(name: string): string {
    const palette = ['#e11d48', '#7c3aed', '#0891b2', '#16a34a', '#d97706', '#2563eb', '#db2777'];
    let h = 0;
    for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
    return palette[h % palette.length];
  }

  function strokeAlphaFor(tool: string): number {
    return tool === 'marker' ? 0.5 : tool === 'pencil' ? 0.7 : 1;
  }

  function drawStrokeSegment(s: BoardStrokeLive, fromIdx: number, toIdx: number) {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.strokeStyle = s.color;
    ctx.lineWidth   = s.size;
    ctx.lineCap     = 'round';
    ctx.lineJoin    = 'round';
    ctx.globalAlpha = s.alpha;
    ctx.beginPath();
    for (let i = Math.max(fromIdx, 0); i <= Math.min(toIdx, s.points.length - 1); i++) {
      const X = s.points[i].x * canvas.width;
      const Y = s.points[i].y * canvas.height;
      if (i === Math.max(fromIdx, 0)) ctx.moveTo(X, Y);
      else ctx.lineTo(X, Y);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  function drawAuthorTag(s: BoardStrokeLive) {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || s.points.length === 0) return;
    const X = s.points[0].x * canvas.width;
    const Y = s.points[0].y * canvas.height;
    ctx.font = '600 10px sans-serif';
    ctx.fillStyle = authorColor(s.author_name);
    ctx.fillText(s.author_name, X + 4, Y - 5);
  }

  function drawTextStroke(s: BoardStrokeLive) {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !s.text_content || s.points.length === 0) return;
    const X = s.points[0].x * canvas.width;
    const Y = s.points[0].y * canvas.height;
    ctx.font = `${Math.max(14, s.size * 5)}px sans-serif`;
    ctx.fillStyle = s.color;
    ctx.globalAlpha = s.alpha;
    ctx.fillText(s.text_content, X, Y);
    ctx.globalAlpha = 1;
  }

  function renderBoard() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (const s of strokesRef.current) {
      if (s.tool === 'text') { drawTextStroke(s); drawAuthorTag(s); continue; }
      if (s.points.length >= 2) {
        drawStrokeSegment(s, 0, s.points.length - 1);
        drawAuthorTag(s);
      }
    }
  }

  async function loadBoardStrokes() {
    if (!collabSession) return;
    const { data } = await supabase
      .from('collab_board_strokes')
      .select('*')
      .eq('session_id', collabSession)
      .order('created_at', { ascending: true })
      .limit(1000);
    strokesRef.current = ((data as unknown as BoardStrokeLive[]) || []).map(s => ({
      ...s, points: (s.points as unknown as { x: number; y: number }[]) || [],
    }));
    renderBoard();
    setBoardVersion(v => v + 1);
  }

  async function eraseBoardAt(pos: { x: number; y: number }) {
    const canvas = canvasRef.current;
    if (!canvas || !collabSession) return;
    const { user: u } = { user: useAuthStore.getState().user };
    if (!u) return;
    const isHostUser = collabRole === 'host';
    // topmost stroke first
    for (let i = strokesRef.current.length - 1; i >= 0; i--) {
      const s = strokesRef.current[i];
      if (!isHostUser && s.author_id !== u.id) continue;
      const hit = s.points.some(p => {
        const dx = p.x * canvas.width - pos.x;
        const dy = p.y * canvas.height - pos.y;
        return dx * dx + dy * dy < 18 * 18;
      });
      if (hit) {
        const { error } = await supabase.from('collab_board_strokes').delete().eq('id', s.id);
        if (error) { toast.error('Only your own marks can be erased.'); return; }
        strokesRef.current.splice(i, 1);
        renderBoard();
        setBoardVersion(v => v + 1);
        return;
      }
    }
  }

  async function undoBoard() {
    const { user: u } = { user: useAuthStore.getState().user };
    if (!u || !collabSession) return;
    const mine = strokesRef.current.filter(s => s.author_id === u.id);
    const last = mine[mine.length - 1];
    if (!last) return;
    await supabase.from('collab_board_strokes').delete().eq('id', last.id);
    strokesRef.current = strokesRef.current.filter(s => s.id !== last.id);
    renderBoard();
    setBoardVersion(v => v + 1);
  }

  async function clearBoard() {
    const { user: u } = { user: useAuthStore.getState().user };
    if (!u || !collabSession) return;
    if (collabRole === 'host') {
      await supabase.from('collab_board_strokes').delete().eq('session_id', collabSession);
      strokesRef.current = [];
    } else {
      const mine = strokesRef.current.filter(s => s.author_id === u.id).map(s => s.id);
      if (mine.length === 0) { toast.error('Only your own marks can be cleared.'); return; }
      await supabase.from('collab_board_strokes').delete().in('id', mine);
      strokesRef.current = strokesRef.current.filter(s => s.author_id !== u.id);
    }
    renderBoard();
    setBoardVersion(v => v + 1);
    toast.success(collabRole === 'host' ? 'Board cleared' : 'Your marks cleared');
  }

  const boardAIContext = useMemo(() => {
    const texts = strokesRef.current.filter(s => s.tool === 'text' && s.text_content).map(s => `"${s.text_content}" (${s.author_name})`);
    const authors = [...new Set(strokesRef.current.map(s => s.author_name))];
    return [
      'The user is on a collaborative whiteboard inside SolveNCERT.',
      collabMode ? `This board is shared live with their study circle (host: ${collabHostName || 'host'}).` : 'Free-form whiteboard.',
      `The board currently has ${strokesRef.current.length} saved marks drawn by: ${authors.join(', ') || 'nobody yet'}.`,
      texts.length ? `Text written on the board: ${texts.join('; ')}.` : 'No text is written on the board yet — only drawings/shapes.',
      'When asked about "the board", interpret the texts above and describe/detect shapes (lines, circles, rectangles) from the drawing description if needed. Ask for a photo/description if the drawing alone is unclear.',
    ].filter(Boolean).join('\n');
    // boardVersion bumps when strokes change → context refreshes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardVersion, collabMode, collabHostName]);

  // Live-load + realtime sync of the shared board
  useEffect(() => {
    if (!collabMode || !collabSession) return;
    const t = setTimeout(loadBoardStrokes, 300);    const chan = supabase.channel(`board-${collabSession}`)
      .on('broadcast', { event: 'board-live' }, ({ payload }) => {
        // live segment from another member who has the board open right now
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx || !payload) return;
        ctx.strokeStyle = payload.color;
        ctx.lineWidth   = payload.lineWidth;
        ctx.lineCap     = 'round';
        ctx.lineJoin    = 'round';
        ctx.globalAlpha = payload.alpha ?? 1;
        ctx.beginPath();
        ctx.moveTo(payload.x0 * canvas.width, payload.y0 * canvas.height);
        ctx.lineTo(payload.x1 * canvas.width, payload.y1 * canvas.height);
        ctx.stroke();
        ctx.globalAlpha = 1;
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'collab_board_strokes', filter: `session_id=eq.${collabSession}` },
        (payload) => {
          const row = payload.new as unknown as BoardStrokeLive;
          if (strokesRef.current.some(s => s.id === row.id)) return;
          const s = { ...row, points: (row.points as unknown as { x: number; y: number }[]) || [] };
          strokesRef.current.push(s);
          if (s.points.length >= 2) drawStrokeSegment(s, 0, s.points.length - 1);
          if (s.tool === 'text') drawTextStroke(s);
          drawAuthorTag(s);
          setBoardVersion(v => v + 1);
        })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'collab_board_strokes', filter: `session_id=eq.${collabSession}` },
        (payload) => {
          const id = (payload.old as { id: string }).id;
          strokesRef.current = strokesRef.current.filter(s => s.id !== id);
          renderBoard();
          setBoardVersion(v => v + 1);
        })
      .subscribe();
    return () => { clearTimeout(t); supabase.removeChannel(chan); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collabMode, collabSession]);

  useEffect(() => {
    if (collabMode && roomStatus === 'ready') initCanvas();
  }, [roomStatus, collabMode]);
  // eslint-disable-next-line react-hooks/exhaustive-deps

  function undo() {
    if (collabMode) { undoBoard(); return; }
    if (history.length === 0) return;
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext('2d')!;
    const prev   = history[history.length - 1];
    ctx.putImageData(prev, 0, 0);
    setHistory(prev => prev.slice(0, -1));
  }

  function clearCanvas(broadcast: boolean = true) {
    if (collabMode) { clearBoard(); return; }
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHistory([]);
    if (broadcast) channelRef.current?.send({ type: 'broadcast', event: 'clear', payload: {} });
  }

  function downloadCanvas() {
    const canvas = canvasRef.current!;
    const link   = document.createElement('a');
    link.download = 'study-room-whiteboard.png';
    link.href     = canvas.toDataURL();
    link.click();
  }

  function sendMessage() {
    if (!message.trim()) return;
    const msg: ChatMessage = {
      id:   crypto.randomUUID(),
      user: user?.full_name || 'You',
      text: message.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, msg]);
    channelRef.current?.send({ type: 'broadcast', event: 'chat', payload: msg });
    setMessage('');
  }

  // ── Lobby: no room code yet — create or join ───────────────────────────
  if (!code) {
    return (
      <Layout title="Study Room | SolveNCERT" description="Create or join a real-time collaborative Study Room with classmates." noFooter>
        <div className="max-w-md mx-auto px-6 py-16">
          <h1 className="text-2xl font-display font-bold text-[var(--text-primary)] mb-2 text-center">Study Room</h1>
          <p className="text-sm text-[var(--text-muted)] text-center mb-8">Solve problems together on a shared, real-time whiteboard.</p>

          <div className="card p-6 mb-4">
            <h2 className="font-semibold text-[var(--text-primary)] mb-1 flex items-center gap-2"><Plus size={16} className="text-blue-500" /> Create a Room</h2>
            <p className="text-xs text-[var(--text-muted)] mb-4">Get an invite code to share with classmates.</p>
            <button onClick={createRoom} disabled={creatingRoom} className="btn-primary w-full justify-center">
              {creatingRoom ? <Loader2 size={15} className="animate-spin" /> : 'Create Study Room'}
            </button>
          </div>

          <div className="card p-6">
            <h2 className="font-semibold text-[var(--text-primary)] mb-1 flex items-center gap-2"><LogIn size={16} className="text-blue-500" /> Join a Room</h2>
            <p className="text-xs text-[var(--text-muted)] mb-4">Enter the invite code someone shared with you.</p>
            <div className="flex gap-2">
              <input
                value={joinCodeInput}
                onChange={e => setJoinCodeInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && joinRoom()}
                placeholder="e.g. A1B2C3"
                className="input-field flex-1 uppercase"
                maxLength={8}
              />
              <button onClick={joinRoom} disabled={joiningRoom || !joinCodeInput.trim()} className="btn-primary whitespace-nowrap">
                {joiningRoom ? <Loader2 size={15} className="animate-spin" /> : 'Join'}
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // ── Room exists but we're still verifying it ───────────────────────────
  if (roomStatus === 'checking') {
    return (
      <Layout title="Study Room | SolveNCERT" noFooter>
        <div className="flex items-center justify-center h-[60vh]"><Loader2 size={24} className="animate-spin text-blue-500" /></div>
      </Layout>
    );
  }

  // ── Invalid or expired code ─────────────────────────────────────────────
  if (roomStatus === 'not-found') {
    return (
      <Layout title="Study Room | SolveNCERT" noFooter>
        <div className="max-w-md mx-auto px-6 py-16 text-center">
          <p className="font-semibold text-[var(--text-primary)] mb-2">Room not found or expired</p>
          <p className="text-sm text-[var(--text-muted)] mb-6">Double-check the invite code, or create a new room.</p>
          <button onClick={() => router.push('/study-room')} className="btn-primary inline-flex">
            Back to Study Room <ChevronRight size={14} />
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Study Room — Collaborative Whiteboard | SolveNCERT" description="Join a real-time collaborative Study Room on SolveNCERT. Solve NCERT problems together with classmates on a shared whiteboard." noFooter>
      <div className="flex h-[calc(100vh-56px)] overflow-hidden">

        {/* ── Toolbar ────────────────────────────────────────────────────── */}
        <aside className="w-12 md:w-14 flex flex-col items-center py-3 gap-1 bg-[var(--surface-0)] border-r border-[var(--border)] flex-shrink-0 overflow-y-auto">
          {/* Tools */}
          {TOOLS.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setTool(id)}
              title={label}
              className={cn(
                'w-9 h-9 rounded-lg flex items-center justify-center transition-all',
                tool === id
                  ? 'bg-blue-600 text-white shadow-glow-blue'
                  : 'text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)]'
              )}
            >
              <Icon size={16} />
            </button>
          ))}

          <hr className="w-7 border-[var(--border)] my-1" />

          {/* Brush size */}
          <div className="flex flex-col items-center gap-1">
            {[1, 3, 6, 10].map(s => (
              <button
                key={s}
                onClick={() => setSize(s)}
                title={`Size ${s}`}
                className={cn(
                  'flex items-center justify-center rounded-full transition-all',
                  size === s ? 'ring-2 ring-blue-500 ring-offset-1' : 'opacity-60 hover:opacity-100',
                )}
                style={{ width: Math.max(s * 2.5, 10), height: Math.max(s * 2.5, 10), background: color, minWidth: 10, minHeight: 10 }}
              />
            ))}
          </div>

          <hr className="w-7 border-[var(--border)] my-1" />

          {/* Colors */}
          {COLORS.map(c => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={cn('w-6 h-6 rounded-full transition-all flex-shrink-0', color === c && 'ring-2 ring-offset-1 ring-blue-500')}
              style={{ background: c, border: c === '#ffffff' ? '1px solid #ddd' : undefined }}
            />
          ))}

          <hr className="w-7 border-[var(--border)] my-1" />

          {/* Actions */}
          <button onClick={undo}          title="Undo"       className="w-9 h-9 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)] transition-all"><RotateCcw  size={15} /></button>
          <button onClick={() => clearCanvas()} title="Clear" className="w-9 h-9 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-500 transition-all"><Trash2 size={15} /></button>
          <button onClick={downloadCanvas}title="Download"   className="w-9 h-9 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)] transition-all"><Download   size={15} /></button>
        </aside>

        {/* ── Canvas ─────────────────────────────────────────────────────── */}
        <div className="flex-1 relative bg-white overflow-hidden">
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ cursor: tool === 'eraser' ? 'cell' : tool === 'text' ? 'text' : 'crosshair', touchAction: 'none' }}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={stopDraw}
            onMouseLeave={stopDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={stopDraw}
          />

          {/* Top-right: room info */}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <div className="glass px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs text-[var(--text-secondary)]">
              <Users size={12} className="text-blue-500" />
              <span>{Math.max(participants.length, 1)} / {maxMembers}</span>
            </div>
            <button onClick={copyInviteLink} className="glass px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs text-[var(--text-secondary)] hover:text-blue-500 transition-colors">
              <Copy size={12} className="text-blue-500" /> Invite
            </button>
            <button
              onClick={() => setChatOpen(!chatOpen)}
              className="glass px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs text-[var(--text-secondary)] hover:text-blue-500 transition-colors"
            >
              <MessageCircle size={12} className="text-blue-500" />
              Chat {messages.length > 1 && <span className="bg-blue-600 text-white rounded-full text-[9px] w-4 h-4 flex items-center justify-center">{messages.length - 1}</span>}
            </button>
          </div>

          {/* Current tool label */}
          <div className="absolute bottom-3 left-3 glass px-3 py-1.5 rounded-xl text-xs text-[var(--text-muted)] capitalize">
            {tool} · Size {size}
          </div>

          {/* Collab board: live sync note + AI follow-up that reads the board */}
          {collabMode && (
            <>
              <div className="absolute top-3 left-3 glass px-3 py-1.5 rounded-xl text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Board synced live · marks saved with your name
              </div>
              <div className="absolute bottom-12 left-3 right-3 sm:right-auto sm:w-[380px] z-20 max-h-[45vh] overflow-y-auto">
                <AIFollowUp
                  context={boardAIContext}
                  subject="general"
                  chapterNumber={0}
                  exerciseLabel="Whiteboard"
                  itemKey={`board-${collabSession}`}
                  onGuestBlock={() => toast.error('Sign up to use AI follow-up.')}
                />
              </div>
            </>
          )}
        </div>

        {/* ── Chat panel ─────────────────────────────────────────────────── */}
        {chatOpen && (
          <aside className="w-72 flex flex-col bg-[var(--surface-0)] border-l border-[var(--border)] animate-slide-up">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
              <span className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
                <MessageCircle size={14} className="text-blue-500" /> Room Chat
              </span>
              <button onClick={() => setChatOpen(false)} className="p-1 rounded-lg hover:bg-[var(--surface-2)] text-[var(--text-muted)]">
                <X size={14} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {messages.map(msg => (
                <div key={msg.id} className={cn('flex flex-col', msg.user === (user?.full_name || 'You') ? 'items-end' : 'items-start')}>
                  <div className={cn(
                    'max-w-[85%] px-3 py-2 rounded-xl text-xs',
                    msg.user === (user?.full_name || 'You')
                      ? 'bg-blue-600 text-white rounded-br-sm'
                      : msg.user === 'System'
                        ? 'bg-[var(--surface-2)] text-[var(--text-muted)] italic w-full text-center'
                        : 'bg-[var(--surface-2)] text-[var(--text-secondary)] rounded-bl-sm'
                  )}>
                    {msg.user !== 'System' && msg.user !== (user?.full_name || 'You') && (
                      <p className="text-[10px] font-semibold mb-0.5 opacity-70">{msg.user}</p>
                    )}
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-[var(--text-muted)] mt-0.5 px-1">{msg.time}</span>
                </div>
              ))}
              <div ref={chatBottom} />
            </div>

            <div className="p-3 border-t border-[var(--border)] flex gap-2">
              <AutoGrowTextarea
                value={message}
                onChange={setMessage}
                onEnter={() => sendMessage()}
                placeholder="Type a message..."
                className="input-field text-xs py-2 flex-1"
              />
              <button onClick={sendMessage} disabled={!message.trim()} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white transition-all">
                <Send size={13} />
              </button>
            </div>
          </aside>
        )}
      </div>
    </Layout>
  );
}
