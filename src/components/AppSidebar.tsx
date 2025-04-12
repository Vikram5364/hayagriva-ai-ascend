
import React, { useState } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { 
  Book, 
  FileText, 
  Github, 
  Home, 
  Layers, 
  LogIn, 
  MenuIcon, 
  MessageSquare, 
  Mic, 
  Settings, 
  User, 
  Code,
} from 'lucide-react';
import HayagrivaLogoHorseUpdate from './HayagrivaLogoHorseUpdate';
import AuthForms from './AuthForms';

// For demo purposes
const isLoggedIn = false;

const AppSidebar = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  return (
    <>
      {/* Mobile Sidebar Trigger */}
      <div className="fixed top-4 left-4 z-40 md:hidden">
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline" size="icon">
              <MenuIcon className="h-4 w-4" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="h-[80vh]">
            <div className="p-4">
              <div className="flex items-center mb-6">
                <HayagrivaLogoHorseUpdate className="w-8 h-8 mr-2" />
                <h2 className="text-lg font-bold">Hayagriva AI</h2>
              </div>
              
              <div className="space-y-6">
                {/* Mobile Navigation */}
                <div className="space-y-2">
                  <MobileSidebarItem icon={Home} label="Home" href="/" />
                  <MobileSidebarItem icon={MessageSquare} label="Chat" href="#chat-section" />
                  <MobileSidebarItem icon={Book} label="Learning Paths" href="/learning" />
                  <MobileSidebarItem icon={FileText} label="Document Reader" href="/reader" />
                  <MobileSidebarItem icon={Code} label="Code Generation" href="/code" />
                  <MobileSidebarItem icon={Mic} label="Voice Assistant" href="#" />
                  <MobileSidebarItem icon={Github} label="GitHub Integration" href="#" />
                  <MobileSidebarItem icon={Layers} label="Subject Explorer" href="#" />
                </div>
                
                {/* Mobile Auth */}
                {!isLoggedIn && (
                  <div className="pt-4 border-t">
                    <Button className="w-full" onClick={() => setShowAuthModal(true)}>
                      <LogIn className="mr-2 h-4 w-4" /> Sign In
                    </Button>
                  </div>
                )}
                
                {isLoggedIn && (
                  <div className="pt-4 border-t flex justify-between items-center">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <User className="h-4 w-4" />
                      </Avatar>
                      <div className="text-sm">
                        <p className="font-medium">User Name</p>
                        <p className="text-xs text-muted-foreground">user@example.com</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
      
      {/* Desktop Sidebar */}
      <Sidebar className="hidden md:flex">
        <SidebarHeader>
          <div className="flex items-center p-2">
            <HayagrivaLogoHorseUpdate className="w-8 h-8 mr-2" />
            <h2 className="text-lg font-bold">Hayagriva AI</h2>
          </div>
        </SidebarHeader>
        
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/">
                      <Home className="h-4 w-4" />
                      <span>Home</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="#chat-section">
                      <MessageSquare className="h-4 w-4" />
                      <span>Chat</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Learning Paths">
                    <a href="/learning">
                      <Book className="h-4 w-4" />
                      <span>Learning Paths</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Document Reader">
                    <a href="/reader">
                      <FileText className="h-4 w-4" />
                      <span>Document Reader</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Code Generation">
                    <a href="/code">
                      <Code className="h-4 w-4" />
                      <span>Code Generation</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          
          <SidebarGroup>
            <SidebarGroupLabel>Tools</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Voice Assistant">
                    <a href="#">
                      <Mic className="h-4 w-4" />
                      <span>Voice Assistant</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="GitHub Integration">
                    <a href="#">
                      <Github className="h-4 w-4" />
                      <span>GitHub Integration</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Subject Explorer">
                    <a href="#">
                      <Layers className="h-4 w-4" />
                      <span>Subject Explorer</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        
        <SidebarFooter>
          {!isLoggedIn ? (
            <div className="p-2">
              <Button 
                className="w-full" 
                onClick={() => setShowAuthModal(true)}
              >
                <LogIn className="mr-2 h-4 w-4" /> Sign In
              </Button>
            </div>
          ) : (
            <div className="p-2 flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <User className="h-4 w-4" />
                </Avatar>
                <div className="text-sm">
                  <p className="font-medium">User Name</p>
                  <p className="text-xs text-muted-foreground">user@example.com</p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          )}
        </SidebarFooter>
      </Sidebar>
      
      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md">
            <Button 
              className="absolute -top-12 right-0" 
              variant="ghost" 
              onClick={() => setShowAuthModal(false)}
            >
              Close
            </Button>
            <AuthForms />
          </div>
        </div>
      )}
    </>
  );
};

// Mobile sidebar item component
const MobileSidebarItem = ({ 
  icon: Icon, 
  label, 
  href 
}: { 
  icon: React.ElementType; 
  label: string;
  href: string;
}) => (
  <a 
    href={href} 
    className="flex items-center p-2 rounded-md hover:bg-accent"
  >
    <Icon className="h-5 w-5 mr-3" />
    <span>{label}</span>
  </a>
);

export default AppSidebar;
