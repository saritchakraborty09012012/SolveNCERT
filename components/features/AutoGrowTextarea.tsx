import React, { useEffect, useRef } from 'react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onEnter?: () => void;
  placeholder?: string;
  className?: string;
  maxLines?: number;
  lineHeightPx?: number;
  autoFocus?: boolean;
}

// Multi-line text box that wraps long text downwards (like ChatGPT), grows up to
// `maxLines` visible lines and then scrolls vertically instead of horizontally.
export default function AutoGrowTextarea({
  value, onChange, onEnter, placeholder, className,
  maxLines = 3, lineHeightPx = 20, autoFocus,
}: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      autoFocus={autoFocus}
      placeholder={placeholder}
      rows={1}
      wrap="soft"
      onChange={e => onChange(e.target.value)}
      onKeyDown={e => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          onEnter?.();
        }
      }}
      className={className}
      style={{
        maxHeight: `${maxLines * lineHeightPx + 22}px`,
        overflowY: 'auto',
        resize: 'none',
        lineHeight: `${lineHeightPx}px`,
      }}
    />
  );
}
