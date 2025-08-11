import { useNavigate } from "react-router-dom"

export function ErrorFallback({ error, resetErrorBoundary }: { error?: Error; resetErrorBoundary?: () => void }) {
  const navigate = useNavigate()

  return (
    <div>
      <h1>{error?.message}</h1>
      <button onClick={resetErrorBoundary ?? (() => navigate(0))}>다시 시도하기</button>
    </div>
  )
}
