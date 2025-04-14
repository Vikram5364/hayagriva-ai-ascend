
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { useState } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AIChatbotPage from "./pages/LearningPathsPage";
import DocumentReaderPage from "./pages/DocumentReaderPage";
import CodeGenerationPage from "./pages/CodeGenerationPage";
import WebAppCreatorPage from "./pages/WebAppCreatorPage";
import AppSidebar from "./components/AppSidebar";
import HayagrivaPowerLogo from "./components/HayagrivaPowerLogo";
import Chat from "./components/Chat";

const queryClient = new QueryClient();

const App = () => {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([
    { role: "assistant", content: "Hello! I'm Hayagriva, your AI assistant. How can I help you today?" }
  ]);

  const handleChatMessage = (message: string) => {
    // Add user message
    setMessages(prev => [...prev, { role: "user", content: message }]);
    
    // Simulate AI thinking
    setTimeout(() => {
      // Add assistant response
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: `I'll help you with "${message}". Is there anything specific you'd like to know about this topic?`
      }]);
    }, 1000);
  };

  return (
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
                      <Route path="/chatbot" element={<AIChatbotPage />} />
                      <Route path="/reader" element={<DocumentReaderPage />} />
                      <Route path="/code" element={<CodeGenerationPage />} />
                      <Route path="/web-app-creator" element={<WebAppCreatorPage />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                    
                    {/* Floating chat assistant available on all pages */}
                    <Chat 
                      messages={messages}
                      onVoiceInput={handleChatMessage}
                      isFloating={true}
                    />
                  </div>
                </SidebarInset>
              </div>
            </SidebarProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
