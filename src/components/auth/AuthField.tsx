type AuthFieldProps = {
  label: string
  type?: string
  value: string
  onChange: (value: string) => void
  error?: string
  autoComplete?: string
}

export function AuthField({
  label,
  type = 'text',
  value,
  onChange,
  error,
  autoComplete,
}: AuthFieldProps) {
  return (
    <label className="block text-sm font-medium text-pitch">
      {label}
      <input
        required
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        className={`mt-1 w-full rounded-2xl border bg-white px-4 py-3 outline-none transition focus:ring-2 ${
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
            : 'border-pitch/15 focus:border-pitch focus:ring-lime/40'
        }`}
      />
      {error ? <span className="mt-1 block text-sm font-normal text-red-600">{error}</span> : null}
    </label>
  )
}
