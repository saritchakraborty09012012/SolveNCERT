import React, { useRef, useState } from 'react';
import { Paperclip, X, FileText, Table } from 'lucide-react';
import { cn } from '@/utils/helpers';

export interface AttachedFile { name: string; type: string; size: number; content: string; }

interface Props { files: AttachedFile[]; onChange: (files: AttachedFile[]) => void; className?: string; }

function fileIcon(type: string) {
  if (type.includes('spreadsheet') || type.includes('csv')) return <Table size={13} />;
  return <FileText size={13} />;
}
function humanSize(b: number) {
  if (b < 1024) return `${b}B`;
  if (b < 1024*1024) return `${(b/1024).toFixed(0)}KB`;
  return `${(b/1024/1024).toFixed(1)}MB`;
}

export default function FileAttach({ files, onChange, className }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');

  const ALLOWED_TYPES = [
    'application/pdf',
    'text/plain',
    'text/markdown',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];

  async function handleFiles(fileList: FileList) {
    setError('');
    const newFiles: AttachedFile[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError(`"${file.name}" type not supported. Use PDF, TXT, MD, DOC, DOCX, CSV, XLSX.`);
        continue;
      }
      const isDup = files.some(f => f.name === file.name && f.size === file.size);
      if (isDup) { setError(`"${file.name}" already attached.`); continue; }
      if (file.size > 10*1024*1024) { setError(`"${file.name}" too large (max 10MB).`); continue; }
      const content = await readFile(file);
      newFiles.push({ name: file.name, type: file.type, size: file.size, content });
    }
    onChange([...files, ...newFiles].slice(0, 5));
  }

  function readFile(file: File): Promise<string> {
    return new Promise(res => {
      const r = new FileReader();
      r.onload = () => res(r.result as string || '');
      r.onerror = () => res('');
      r.readAsText(file);
    });
  }

  function remove(idx: number) { onChange(files.filter((_,i)=>i!==idx)); }

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {files.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {files.map((f,i) => (
            <div key={i} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-xs text-[var(--text-secondary)] max-w-[160px]">
              <span className="text-blue-500 flex-shrink-0">{fileIcon(f.type)}</span>
              <span className="truncate flex-1">{f.name}</span>
              <span className="text-[var(--text-muted)] text-[10px]">{humanSize(f.size)}</span>
              <button onClick={()=>remove(i)} className="text-[var(--text-muted)] hover:text-red-500"><X size={11}/></button>
            </div>
          ))}
        </div>
      )}
      {error && <p className="text-[11px] text-red-500">{error}</p>}
      <button onClick={()=>inputRef.current?.click()} title="Attach file"
        className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-muted)] hover:text-blue-500 hover:border-blue-300 transition-all">
        <Paperclip size={13}/>
      </button>
      <input ref={inputRef} type="file" multiple accept=".pdf,.txt,.md,.doc,.docx,.csv,.xlsx" className="hidden"
        onChange={e=>{if(e.target.files)handleFiles(e.target.files); e.target.value='';}}/>
    </div>
  );
}
