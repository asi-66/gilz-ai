import { Suspense, lazy } from "react"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

// Fallback loading component
import { Loader } from "@/components/common/Loader"

// Lazy loaded components
const Index = lazy(() => import("./pages/Index"))
const NotFound = lazy(() => import("./pages/NotFound"))
const Dashboard = lazy(() => import("./pages/Dashboard"))
const JobFlow = lazy(() => import("./pages/Dashboard/JobFlow"))
const JobFlowDetail = lazy(() => import("./pages/Dashboard/JobFlowDetail"))
const Settings = lazy(() => import("./pages/Dashboard/Settings"))
const Help = lazy(() => import("./pages/Dashboard/Help"))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }
  
  return children
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
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
            
            {/* Protected Dashboard Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Suspense fallback={<Loader />}>
                    <Dashboard />
                  </Suspense>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/job-flow" 
              element={
                <ProtectedRoute>
                  <Suspense fallback={<Loader />}>
                    <JobFlow />
                  </Suspense>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/job-flow/:id" 
              element={
                <ProtectedRoute>
                  <Suspense fallback={<Loader />}>
                    <JobFlowDetail />
                  </Suspense>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/settings" 
              element={
                <ProtectedRoute>
                  <Suspense fallback={<Loader />}>
                    <Settings />
                  </Suspense>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/help" 
              element={
                <ProtectedRoute>
                  <Suspense fallback={<Loader />}>
                    <Help />
                  </Suspense>
                </ProtectedRoute>
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
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
