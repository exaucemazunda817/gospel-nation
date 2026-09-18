'use client';

import { useId } from 'react';

const inputClass =
  'min-h-[44px] w-full rounded-lg border border-white/15 bg-gn-field px-4 py-2.5 text-gn-cream shadow-sm transition-colors placeholder:text-gn-cream/40 focus:border-gn-gold focus:outline-none focus:ring-2 focus:ring-gn-gold/30';

export function Field({
  label,
  name,
  type = 'text',
  required,
  placeholder,
  defaultValue
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
}) {
  const id = useId();
  return (
    <div className="text-sm">
      <label htmlFor={id} className="mb-1.5 block font-medium text-gn-ink/80">
        {label}
        {required && <span className="text-gn-gold"> *</span>}
      </label>
      <input
        id={id}
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className={inputClass}
      />
    </div>
  );
}

export function SelectField({
  label,
  name,
  required,
  children
}: {
  label: string;
  name: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  const id = useId();
  return (
    <div className="text-sm">
      <label htmlFor={id} className="mb-1.5 block font-medium text-gn-ink/80">
        {label}
        {required && <span className="text-gn-gold"> *</span>}
      </label>
      <select id={id} name={name} required={required} className={inputClass}>
        {children}
      </select>
    </div>
  );
}

export function FileField({
  label,
  name,
  required,
  accept,
  hint,
  onChange
}: {
  label: string;
  name: string;
  required?: boolean;
  accept?: string;
  hint?: string;
  onChange?: (file: File | null) => void;
}) {
  const id = useId();
  const hintId = useId();
  return (
    <div className="text-sm">
      <label htmlFor={id} className="mb-1.5 block font-medium text-gn-ink/80">
        {label}
        {required && <span className="text-gn-gold"> *</span>}
      </label>
      <input
        id={id}
        type="file"
        name={name}
        required={required}
        accept={accept}
        aria-describedby={hint ? hintId : undefined}
        onChange={(e) => onChange?.(e.currentTarget.files?.[0] ?? null)}
        className="block min-h-[44px] w-full rounded-lg border border-white/15 bg-gn-field px-4 py-2.5 text-sm text-gn-cream/80 shadow-sm transition-colors file:mr-3 file:rounded-full file:border-0 file:bg-gn-gold file:px-4 file:py-1.5 file:text-sm file:font-semibold file:text-gn-black focus:border-gn-gold focus:outline-none focus:ring-2 focus:ring-gn-gold/30"
      />
      {hint && (
        <span id={hintId} className="mt-1 block text-xs text-gn-ink/50">
          {hint}
        </span>
      )}
    </div>
  );
}

export function CheckboxField({
  label,
  name,
  defaultChecked
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  const id = useId();
  return (
    <div className="flex items-start gap-2.5 text-sm text-gn-ink/80">
      <input
        id={id}
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-0.5 h-4 w-4 rounded border-white/30 text-gn-gold focus:ring-gn-gold/40"
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}

export function TextAreaField({
  label,
  name,
  required,
  rows = 5
}: {
  label: string;
  name: string;
  required?: boolean;
  rows?: number;
}) {
  const id = useId();
  return (
    <div className="text-sm">
      <label htmlFor={id} className="mb-1.5 block font-medium text-gn-ink/80">
        {label}
        {required && <span className="text-gn-gold"> *</span>}
      </label>
      <textarea id={id} name={name} required={required} rows={rows} className={inputClass} />
    </div>
  );
}
