
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LearningPathsPage from "./pages/LearningPathsPage";
import DocumentReaderPage from "./pages/DocumentReaderPage";
import CodeGenerationPage from "./pages/CodeGenerationPage";
import AppSidebar from "./components/AppSidebar";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SidebarProvider>
            <div className="min-h-screen flex w-full">
              <AppSidebar />
              <SidebarInset>
                <div className="relative">
                  {/* Mobile sidebar trigger */}
                  <div className="md:hidden absolute top-4 left-4 z-10">
                    <SidebarTrigger />
                  </div>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/learning" element={<LearningPathsPage />} />
                    <Route path="/reader" element={<DocumentReaderPage />} />
                    <Route path="/code" element={<CodeGenerationPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </SidebarInset>
            </div>
          </SidebarProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
