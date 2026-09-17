export function Rating({ value, reviews }: { value: number; reviews?: number }) {
  const full = Math.round(value)
  return (
    <div className="flex items-center gap-1.5 text-sm">
      <div className="flex text-lime-dark" aria-label={`${value} de 5`}>
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i}>{i < full ? '★' : '☆'}</span>
        ))}
      </div>
      <span className="font-semibold text-pitch">{value.toFixed(1)}</span>
      {reviews != null ? (
        <span className="text-neutral-500">({reviews})</span>
      ) : null}
    </div>
  )
}
