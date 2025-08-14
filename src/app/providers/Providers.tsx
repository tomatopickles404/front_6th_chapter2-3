import { QueryClient, QueryClientProvider, QueryErrorResetBoundary } from "@tanstack/react-query"
import { ErrorBoundary } from "react-error-boundary"
import { OverlayProvider } from "overlay-kit"
import { ErrorFallback } from "shared/components/ErrorFallback"
import { Suspense, type ReactNode } from "react"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
    mutations: {
      retry: 1,
    },
  },
})

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <ErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} />
          )}
        >
          <QueryClientProvider client={queryClient}>
            <OverlayProvider>
              <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
            </OverlayProvider>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}
