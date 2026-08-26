import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Pen, Eraser, Type, Highlighter, Undo2, Redo2, Trash2, Save } from 'lucide-react';
import { cn } from '@/utils/helpers';

interface Props {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onSave?: (dataUrl: string) => void;
}

type Tool = 'pen' | 'fountain' | 'pencil' | 'eraser' | 'highlighter' | 'text';
type Color = string;

const TOOLS: { id: Tool; icon: React.ElementType; label: string }[] = [
  { id: 'pen', icon: Pen, label: 'Pen' },
  { id: 'fountain', icon: Pen, label: 'Fountain Pen' },
  { id: 'pencil', icon: Pen, label: 'Pencil' },
  { id: 'eraser', icon: Eraser, label: 'Eraser' },
  { id: 'highlighter', icon: Highlighter, label: 'Highlighter' },
  { id: 'text', icon: Type, label: 'Text Box' },
];

const COLORS: Color[] = [
  '#1a2744', '#c74b3f', '#2b7a4b', '#1a5fb4', '#8b5cf6',
  '#d97706', '#0f172a', '#dc2626', '#059669', '#2563eb',
];

const SIZES = [2, 4, 6, 8, 12];

export default function WhiteboardTools({ canvasRef, onSave }: Props) {
  const [activeTool, setActiveTool] = useState<Tool>('pen');
  const [color, setColor] = useState<Color>('#1a2744');
  const [size, setSize] = useState(4);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [textInput, setTextInput] = useState('');
  const [textPos, setTextPos] = useState<{ x: number; y: number } | null>(null);
  const isDrawing = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const ctx = canvasRef.current?.getContext('2d');

  function saveState() {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(dataUrl);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }

  function undo() {
    if (historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    restoreState(history[newIndex]);
  }

  function redo() {
    if (historyIndex >= history.length - 1) return;
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    restoreState(history[newIndex]);
  }

  function restoreState(dataUrl: string) {
    if (!canvasRef.current || !ctx) return;
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = dataUrl;
  }

  function clearCanvas() {
    if (!canvasRef.current || !ctx) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    saveState();
  }

  function handleSave() {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL();
    onSave?.(dataUrl);
  }

  const getPos = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvasRef.current.width / rect.width),
      y: (clientY - rect.top) * (canvasRef.current.height / rect.height),
    };
  }, [canvasRef]);

  function startDraw(e: React.MouseEvent | React.TouchEvent) {
    if (!ctx || activeTool === 'text') return;
    isDrawing.current = true;
    const pos = getPos(e);
    lastPos.current = pos;
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.strokeStyle = activeTool === 'eraser' ? 'rgba(0,0,0,0)' : color;
    ctx.lineWidth = activeTool === 'eraser' ? size * 4 : size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (activeTool === 'pencil') {
      ctx.globalAlpha = 0.5;
      ctx.lineWidth = size * 0.7;
    } else if (activeTool === 'highlighter') {
      ctx.globalAlpha = 0.3;
      ctx.lineWidth = size * 3;
      ctx.strokeStyle = color;
    } else if (activeTool === 'fountain') {
      ctx.lineWidth = size * 1.5;
    }
  }

  function draw(e: React.MouseEvent | React.TouchEvent) {
    if (!isDrawing.current || !ctx || activeTool === 'text') return;
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPos.current = pos;
  }

  function stopDraw() {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    if (ctx) ctx.globalAlpha = 1;
    saveState();
  }

  function handleCanvasClick(e: React.MouseEvent) {
    if (activeTool !== 'text') return;
    const pos = getPos(e);
    setTextPos(pos);
  }

  function placeText() {
    if (!ctx || !textPos || !textInput.trim()) return;
    ctx.font = `${size * 4 + 12}px 'Kalam', cursive`;
    ctx.fillStyle = color;
    ctx.fillText(textInput, textPos.x, textPos.y);
    setTextInput('');
    setTextPos(null);
    saveState();
  }

  useEffect(() => {
    if (canvasRef.current) {
      saveState();
    }
  }, []);

  return (
    <div className="whiteboard-toolbar flex-wrap">
      {/* Tools */}
      <div className="flex gap-1 pr-2 border-r border-[var(--border)]">
        {TOOLS.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveTool(id)}
            title={label}
            className={cn('whiteboard-tool', activeTool === id && 'active')}
          >
            <Icon size={16} />
          </button>
        ))}
      </div>

      {/* Colors */}
      <div className="flex gap-1 px-2 border-r border-[var(--border)]">
        {COLORS.map(c => (
          <button
            key={c}
            onClick={() => setColor(c)}
            title={c}
            className={cn(
              'w-6 h-6 rounded-full border-2 transition-all',
              color === c ? 'border-[var(--text-primary)] scale-110' : 'border-transparent hover:scale-105'
            )}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>

      {/* Sizes */}
      <div className="flex gap-1 px-2 border-r border-[var(--border)] items-center">
        {SIZES.map(s => (
          <button
            key={s}
            onClick={() => setSize(s)}
            title={`Size ${s}`}
            className={cn(
              'flex items-center justify-center w-7 h-7 rounded-lg transition-all',
              size === s ? 'bg-[var(--surface-3)]' : 'hover:bg-[var(--surface-2)]'
            )}
          >
            <div
              className="rounded-full bg-[var(--text-primary)]"
              style={{ width: s + 2, height: s + 2 }}
            />
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-1 pl-2">
        <button onClick={undo} title="Undo" className="whiteboard-tool">
          <Undo2 size={14} />
        </button>
        <button onClick={redo} title="Redo" className="whiteboard-tool">
          <Redo2 size={14} />
        </button>
        <button onClick={clearCanvas} title="Clear all" className="whiteboard-tool text-red-500">
          <Trash2 size={14} />
        </button>
        <button onClick={handleSave} title="Save annotation" className="whiteboard-tool text-green-600">
          <Save size={14} />
        </button>
      </div>

      {/* Text input overlay */}
      {activeTool === 'text' && textPos && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => setTextPos(null)}>
          <div className="bg-[var(--surface-0)] rounded-xl p-4 shadow-xl border border-[var(--border)]" onClick={e => e.stopPropagation()}>
            <input
              autoFocus
              value={textInput}
              onChange={e => setTextInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') placeText(); }}
              placeholder="Type your text..."
              className="input-field w-64"
            />
            <div className="flex gap-2 mt-2">
              <button onClick={placeText} className="btn-primary text-xs px-4 py-1.5">Place</button>
              <button onClick={() => setTextPos(null)} className="btn-ghost text-xs px-4 py-1.5">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
