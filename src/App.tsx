
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "@/hooks/use-auth"
import Index from "./pages/Index"
import NotFound from "./pages/NotFound"

// Dashboard pages
import Dashboard from "./pages/Dashboard"
import JobFlow from "./pages/Dashboard/JobFlow"
import JobFlowDetail from "./pages/Dashboard/JobFlowDetail"
import Settings from "./pages/Dashboard/Settings"
import Help from "./pages/Dashboard/Help"

const queryClient = new QueryClient()

const ProtectedRoute = ({ children }) => {
  const { session } = useAuth()
  
  if (!session) {
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
            <Route path="/" element={<Index />} />
            
            {/* Protected Dashboard Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/job-flow" 
              element={
                <ProtectedRoute>
                  <JobFlow />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/job-flow/:id" 
              element={
                <ProtectedRoute>
                  <JobFlowDetail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/settings" 
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/help" 
              element={
                <ProtectedRoute>
                  <Help />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
