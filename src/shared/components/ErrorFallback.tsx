export function ErrorFallback({ error, resetErrorBoundary }: { error?: Error; resetErrorBoundary?: () => void }) {
  return (
    <div className="p-4 text-center">
      <h1 className="text-xl font-bold text-red-600 mb-4">오류가 발생했습니다</h1>
      <p className="text-gray-600 mb-4">{error?.message}</p>
      <button onClick={resetErrorBoundary} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        다시 시도하기
      </button>
    </div>
  )
}
