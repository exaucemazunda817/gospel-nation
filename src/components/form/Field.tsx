const inputClass =
  'w-full rounded-xl border border-white/15 bg-[#2a231b] px-4 py-2.5 text-gn-cream shadow-sm transition-colors placeholder:text-gn-cream/40 focus:border-gn-gold focus:outline-none focus:ring-2 focus:ring-gn-gold/30';

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
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium text-gn-ink/80">
        {label}
        {required && <span className="text-gn-gold"> *</span>}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className={inputClass}
      />
    </label>
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
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium text-gn-ink/80">
        {label}
        {required && <span className="text-gn-gold"> *</span>}
      </span>
      <select name={name} required={required} className={inputClass}>
        {children}
      </select>
    </label>
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
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium text-gn-ink/80">
        {label}
        {required && <span className="text-gn-gold"> *</span>}
      </span>
      <input
        type="file"
        name={name}
        required={required}
        accept={accept}
        onChange={(e) => onChange?.(e.currentTarget.files?.[0] ?? null)}
        className="block w-full rounded-xl border border-white/15 bg-[#2a231b] px-4 py-2.5 text-sm text-gn-cream/80 shadow-sm transition-colors file:mr-3 file:rounded-full file:border-0 file:bg-gn-gold file:px-4 file:py-1.5 file:text-sm file:font-semibold file:text-gn-black focus:border-gn-gold focus:outline-none focus:ring-2 focus:ring-gn-gold/30"
      />
      {hint && <span className="mt-1 block text-xs text-gn-ink/50">{hint}</span>}
    </label>
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
  return (
    <label className="flex items-start gap-2.5 text-sm text-gn-ink/80">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-0.5 h-4 w-4 rounded border-white/30 text-gn-gold focus:ring-gn-gold/40"
      />
      <span>{label}</span>
    </label>
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
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium text-gn-ink/80">
        {label}
        {required && <span className="text-gn-gold"> *</span>}
      </span>
      <textarea name={name} required={required} rows={rows} className={inputClass} />
    </label>
  );
}
