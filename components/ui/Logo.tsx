import React, { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/utils/helpers';

export function SolveNCERTLogo({ size=32, className, withText=true, textSize='text-[15px]', linkToHome=false }: {
  size?: number; className?: string; withText?: boolean; textSize?: string; linkToHome?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const el = (
    <div className={cn('flex items-center gap-2 flex-shrink-0', className)}>
      <div className="relative flex-shrink-0"
        style={{ width:size, height:size, aspectRatio:'1/1', flexShrink:0 }}>
        {/* Soft brass-gold halo behind the mark */}
        <div className="absolute inset-0 rounded-lg blur-[6px] opacity-70"
          style={{ background:'linear-gradient(135deg,#d3b26a88,#a98bd855,#2f4bd055)', transform:'scale(1.25)' }} />
        <div className="relative w-full h-full rounded-lg overflow-hidden ring-1 ring-white/25"
          style={{ boxShadow:'0 6px 18px rgba(12,14,26,0.35), inset 0 1px 0 rgba(255,255,255,0.35)' }}>
          {!failed ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src="/solvencert-logo.png" alt="SolveNCERT" width={size} height={size}
              style={{ width:size, height:size, objectFit:'contain', display:'block', aspectRatio:'1/1' }}
              onError={() => setFailed(true)} />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-black text-white rounded-lg"
              style={{ background:'linear-gradient(135deg,#2f4bd0,#7c3aed)', fontSize:Math.round(size*0.42) }}>SN</div>
          )}
        </div>
      </div>
      {withText && (
        <span className={cn('font-display font-bold tracking-tight whitespace-nowrap', textSize)}>
          <span className="text-[var(--ribbon-text)]">Solve</span>
          <span className="bg-gradient-to-r from-gold-300 via-blue-200 to-violet-300 bg-clip-text text-transparent">NCERT</span>
        </span>
      )}
    </div>
  );
  return linkToHome ? <Link href="/" className="flex items-center">{el}</Link> : el;
}

export function NovexaLogo({ size=24, className, withText=true, onDark=false }: { size?: number; className?: string; withText?: boolean; onDark?: boolean; }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={cn('flex items-center gap-1.5 flex-shrink-0', className)}>
      <div className="flex-shrink-0 rounded-lg overflow-hidden border border-[var(--border)] shadow-sm"
        style={{ width:size, height:size, background:'#fff' }}>
        {!failed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/novexa-logo-64.png" alt="Novexa" width={size} height={size}
            style={{ width:size, height:size, objectFit:'cover', display:'block' }}
            onError={() => setFailed(true)} />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-black text-white"
            style={{ background:'linear-gradient(135deg,#0f0c29,#302b63)', fontSize:Math.round(size*0.35) }}>NX</div>
        )}
      </div>
      {withText && <span className={cn('font-semibold text-xs tracking-[0.08em]', onDark ? 'text-[var(--ribbon-text)]/70' : 'text-[var(--text-secondary)]')}>NOVEXA</span>}
    </div>
  );
}

export function BrandLogo({ size=36, className, onDark=false }: { size?: number; className?: string; onDark?: boolean; }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={cn('flex items-center gap-2.5 flex-shrink-0', className)}>
      <div className="relative flex-shrink-0" style={{ width:size, height:size }}>
        <div className="absolute inset-0 rounded-xl blur-md opacity-60"
          style={{ background:'linear-gradient(135deg,#2f4bd066,#7c3aed55)', transform:'scale(1.3)' }} />
        <div className="relative w-full h-full rounded-xl overflow-hidden border border-[var(--border)] shadow-soft-sm"
          style={{ background:'#fff' }}>
          {!failed ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src="/solvencert-logo.png" alt="SolveNCERT" width={size} height={size}
              style={{ width:size, height:size, objectFit:'contain', display:'block', aspectRatio:'1/1' }}
              onError={() => setFailed(true)} />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-black text-white rounded-xl"
              style={{ background:'linear-gradient(135deg,#2f4bd0,#7c3aed)', fontSize:Math.round(size*0.38) }}>SN</div>
          )}
        </div>
      </div>
      <div>
        <span className={cn('font-display font-bold', onDark ? 'text-white' : 'text-[var(--text-primary)]')}>
          Solve<span className="bg-gradient-to-r from-[#2f4bd0] to-[#7c3aed] bg-clip-text text-transparent">NCERT</span>
        </span>
        <p className={cn('text-[9px] tracking-widest uppercase', onDark ? 'text-[var(--ribbon-text)]/50' : 'text-[var(--text-muted)]')}>for CBSE</p>
      </div>
    </div>
  );
}