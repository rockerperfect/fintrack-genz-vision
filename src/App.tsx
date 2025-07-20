/**
 * App.tsx
 *
 * Root application component for Fintrack GenZ Vision.
 * - Integrates global providers (React Query, Tooltip, Toaster)
 * - Sets up routing for all pages (Index, NotFound)
 * - Ensures extensibility for future routes and providers
 *
 * Dependencies:
 * - @tanstack/react-query: QueryClientProvider for data fetching
 * - react-router-dom: BrowserRouter for SPA routing
 * - Custom UI components: Toaster, Sonner, TooltipProvider
 *
 * NOTE: All new routes must be added above the catch-all "*" route.
 * TODO: Add authentication and protected routes when backend is available.
 */

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Create a single QueryClient instance for the app
const queryClient = new QueryClient();

/**
 * Main application component
 * Wraps all providers and sets up routing structure
 */
const App = () => (
  <QueryClientProvider client={queryClient}>
    {/* TooltipProvider enables tooltips globally */}
    <TooltipProvider>
      {/* Toaster and Sonner provide notification systems */}
      <Toaster />
      <Sonner />
      {/* BrowserRouter enables SPA navigation */}
      <BrowserRouter>
        <Routes>
          {/* Home page route */}
          <Route path="/" element={<Index />} />
          {/* Catch-all route for 404s; always keep last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
