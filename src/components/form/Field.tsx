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
