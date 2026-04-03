export default function FieldErrorMessage({ message }: { message?: string }) {
  if (!message) return;
  return (
    <p className="text-red-400 text-xs font-bold underline">{message}</p>
  )
}

export { FieldErrorMessage };
