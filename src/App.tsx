
import { Suspense, lazy } from "react"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuroraBackground } from "@/components/ui/aurora-background"

// Fallback loading component
import { Loader } from "@/components/common/Loader"

// Lazy loaded components
const Index = lazy(() => import("./pages/Index"))
const NotFound = lazy(() => import("./pages/NotFound"))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <AuroraBackground>
            <Toaster />
            <Sonner />
            <Routes>
              <Route 
                path="/" 
                element={
                  <Suspense fallback={<Loader />}>
                    <Index />
                  </Suspense>
                } 
              />
              
              {/* Catch-all route */}
              <Route 
                path="*" 
                element={
                  <Suspense fallback={<Loader />}>
                    <NotFound />
                  </Suspense>
                } 
              />
            </Routes>
          </AuroraBackground>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
