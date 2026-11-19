"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import type { Option, OptionGroup } from "@/content/contact";
import styles from "./Select.module.css";

/**
 * Styled dropdown (dark trigger + floating list) with keyboard support:
 * Enter/Space toggle, arrows move, Escape closes, letters jump.
 * Submits its value through a hidden input named `name`.
 */
export default function Select({
  name,
  placeholder,
  options,
  groups,
  value,
  onChange,
}: {
  name: string;
  placeholder: string;
  options?: Option[];
  groups?: OptionGroup[];
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const flat = useMemo(() => (groups ? groups.flatMap((g) => g.options) : options ?? []), [groups, options]);
  const selected = flat.find((o) => o.value === value);

  // close on outside pointer
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  // keep the highlighted / selected option visible
  useEffect(() => {
    if (!open) return;
    const index = highlight >= 0 ? highlight : flat.findIndex((o) => o.value === value);
    listRef.current?.querySelector<HTMLElement>(`[data-index="${index}"]`)?.scrollIntoView({ block: "nearest" });
  }, [open, highlight, flat, value]);

  const choose = (v: string) => {
    onChange(v);
    setOpen(false);
    setHighlight(-1);
    triggerRef.current?.focus();
  };

  const openAt = () => {
    setOpen(true);
    setHighlight(Math.max(0, flat.findIndex((o) => o.value === value)));
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!open) openAt();
      else if (highlight >= 0) choose(flat[highlight].value);
      else setOpen(false);
    } else if (e.key === "Escape" && open) {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) return openAt();
      const step = e.key === "ArrowDown" ? 1 : -1;
      setHighlight((h) => (h + step + flat.length) % flat.length);
    } else if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
      const i = flat.findIndex((o) => o.label.trim().toLowerCase().startsWith(e.key.toLowerCase()));
      if (i !== -1) {
        setOpen(true);
        setHighlight(i);
      }
    }
  };

  let index = 0;
  const renderOption = (o: Option) => {
    const i = index++;
    const isSelected = o.value === value;
    return (
      <div
        key={o.value}
        role="option"
        data-index={i}
        aria-selected={isSelected}
        className={styles.option}
        data-selected={isSelected || undefined}
        data-highlighted={i === highlight || undefined}
        onClick={() => choose(o.value)}
      >
        <span>{o.label}</span>
        {isSelected && (
          <svg className={styles.check} viewBox="0 0 24 24" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" fill="none" stroke="#0055ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
    );
  };

  return (
    <div ref={rootRef} className={styles.root}>
      <input type="hidden" name={name} value={value} />
      <div
        ref={triggerRef}
        role="combobox"
        tabIndex={0}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        className={styles.trigger}
        data-open={open || undefined}
        onClick={() => (open ? setOpen(false) : openAt())}
        onKeyDown={onKeyDown}
      >
        <span className={styles.label} data-placeholder={!selected || undefined}>
          {selected ? selected.label : placeholder}
        </span>
        <span className={styles.chevron} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </div>
      <div ref={listRef} id={listId} role="listbox" className={styles.menu} data-open={open || undefined}>
        {groups
          ? groups.map((g) => (
              <div key={g.label} role="group" aria-label={g.label}>
                <div className={styles.groupHeader}>{g.label}</div>
                {g.options.map(renderOption)}
              </div>
            ))
          : flat.map(renderOption)}
      </div>
    </div>
  );
}
