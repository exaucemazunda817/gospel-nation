'use client';

import { useId, useState } from 'react';
import type { FormEvent } from 'react';

const inputClass =
  'min-h-[44px] w-full rounded-lg border border-white/15 bg-gn-field px-4 py-2.5 text-gn-cream shadow-sm transition-colors placeholder:text-gn-cream/40 focus:border-gn-gold focus:outline-none focus:ring-2 focus:ring-gn-gold/30 aria-invalid:border-red-400 aria-invalid:ring-2 aria-invalid:ring-red-400/30';

type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

function messageFor(el: Control): string {
  const v = el.validity;
  if (v.valueMissing) {
    if (el instanceof HTMLSelectElement) return 'Veuillez faire un choix.';
    if (el.type === 'file') return 'Veuillez choisir un fichier.';
    return 'Ce champ est obligatoire.';
  }
  if (v.typeMismatch) {
    if (el.type === 'email') return 'Cette adresse e-mail n’est pas valide.';
    if (el.type === 'url') return 'Ce lien n’est pas valide.';
  }
  return el.validationMessage || 'Cette valeur n’est pas valide.';
}

// Erreur affichée sous le champ (au lieu de la bulle du navigateur, qui n'est
// ni stylée ni toujours en français) : le message est lu par les lecteurs
// d'écran, le champ est marqué invalide, et le premier champ fautif reçoit le
// focus. Elle disparaît dès que le visiteur corrige. Repris de One Love.
function useFieldError() {
  const [error, setError] = useState<string | null>(null);
  const errorId = useId();
  return {
    error,
    errorId,
    controlProps: {
      'aria-invalid': error ? (true as const) : undefined,
      'aria-describedby': error ? errorId : undefined,
      onInvalid: (e: FormEvent<Control>) => {
        // Empêche la bulle native ; sans elle le navigateur ne place plus le
        // focus tout seul, donc on le donne au premier champ invalide.
        e.preventDefault();
        const el = e.currentTarget;
        setError(messageFor(el));
        if (el.form?.querySelector(':invalid') === el) el.focus();
      },
      clear: () => setError(null)
    }
  };
}

function FieldError({ id, message }: { id: string; message: string | null }) {
  if (!message) return null;
  return (
    <p
      id={id}
      role="alert"
      className="mt-1.5 inline-block rounded-md border border-red-400/40 bg-red-950 px-2.5 py-1 text-xs font-medium text-red-100"
    >
      {message}
    </p>
  );
}

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
  const { error, errorId, controlProps: { clear, ...fieldProps } } = useFieldError();
  return (
    <div className="text-sm">
      <label htmlFor={id} className="mb-1.5 block font-medium text-gn-ink/80">
        {label}
        {required && <span className="text-gn-gold-line" aria-hidden="true"> *</span>}
      </label>
      <input
        id={id}
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className={inputClass}
        {...fieldProps}
        onChange={clear}
      />
      <FieldError id={errorId} message={error} />
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
  const { error, errorId, controlProps: { clear, ...fieldProps } } = useFieldError();
  return (
    <div className="text-sm">
      <label htmlFor={id} className="mb-1.5 block font-medium text-gn-ink/80">
        {label}
        {required && <span className="text-gn-gold-line" aria-hidden="true"> *</span>}
      </label>
      <select id={id} name={name} required={required} className={inputClass} {...fieldProps} onChange={clear}>
        {children}
      </select>
      <FieldError id={errorId} message={error} />
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
  const { error, errorId, controlProps: { clear, ...fieldProps } } = useFieldError();
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined;
  return (
    <div className="text-sm">
      <label htmlFor={id} className="mb-1.5 block font-medium text-gn-ink/80">
        {label}
        {required && <span className="text-gn-gold-line" aria-hidden="true"> *</span>}
      </label>
      <input
        id={id}
        type="file"
        name={name}
        required={required}
        accept={accept}
        {...fieldProps}
        aria-describedby={describedBy}
        onChange={(e) => {
          clear();
          onChange?.(e.currentTarget.files?.[0] ?? null);
        }}
        className="block min-h-[44px] w-full rounded-lg border border-white/15 bg-gn-field px-4 py-2.5 text-sm text-gn-cream/80 shadow-sm transition-colors file:mr-3 file:rounded-full file:border-0 file:bg-gn-gold file:px-4 file:py-1.5 file:text-sm file:font-semibold file:text-gn-black focus:border-gn-gold focus:outline-none focus:ring-2 focus:ring-gn-gold/30"
      />
      {hint && (
        <span id={hintId} className="mt-1 block text-xs text-gn-ink/50">
          {hint}
        </span>
      )}
      <FieldError id={errorId} message={error} />
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
    <div className="flex items-start gap-3 text-sm text-gn-ink/80">
      <input
        id={id}
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-2.5 h-5 w-5 shrink-0 cursor-pointer rounded border-white/30 text-gn-gold focus:ring-gn-gold/40"
      />
      <label htmlFor={id} className="flex min-h-[44px] cursor-pointer items-center">
        {label}
      </label>
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
  const { error, errorId, controlProps: { clear, ...fieldProps } } = useFieldError();
  return (
    <div className="text-sm">
      <label htmlFor={id} className="mb-1.5 block font-medium text-gn-ink/80">
        {label}
        {required && <span className="text-gn-gold-line" aria-hidden="true"> *</span>}
      </label>
      <textarea id={id} name={name} required={required} rows={rows} className={inputClass} {...fieldProps} onChange={clear} />
      <FieldError id={errorId} message={error} />
    </div>
  );
}
