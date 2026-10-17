import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Database, MessageSquare, Settings, BrainCircuit, Menu, X } from 'lucide-react';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';

export const MainLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-background flex relative">
      
      {/* Mobile Top Navigation */}
      <div className="md:hidden absolute top-0 left-0 right-0 h-16 bg-white border-b border-border flex items-center justify-between px-4 z-40 shadow-sm">
        <div className="flex items-center">
          <BrainCircuit className="w-5 h-5 text-primary mr-2" />
          <span className="font-bold text-lg text-text-primary tracking-tight">InsightDesk AI</span>
        </div>
        <button onClick={toggleMenu} className="p-2 -mr-2 text-text-secondary hover:text-primary transition-colors">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm animate-in fade-in"
          onClick={closeMenu}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-[280px] md:w-64 border-r border-border bg-white flex flex-col shadow-2xl md:shadow-none
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-border shrink-0">
          <div className="flex items-center">
            <BrainCircuit className="w-6 h-6 text-primary mr-2" />
            <span className="font-bold text-lg text-text-primary tracking-tight">InsightDesk AI</span>
          </div>
          <button onClick={closeMenu} className="md:hidden p-1 text-text-secondary">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="mb-6">
            <p className="px-2 text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
              Workspace
            </p>
            <WorkspaceSwitcher />
          </div>

          <p className="px-2 text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
            Menu
          </p>
          <nav className="space-y-1">
            <NavLink
              to="/"
              onClick={closeMenu}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 md:py-2 rounded-md transition-colors ${
                  isActive 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'text-text-secondary hover:bg-muted hover:text-text-primary'
                }`
              }
            >
              <MessageSquare className="w-5 h-5 mr-3" />
              Ask AI
            </NavLink>
            <NavLink
              to="/ingestion"
              onClick={closeMenu}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 md:py-2 rounded-md transition-colors ${
                  isActive 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'text-text-secondary hover:bg-muted hover:text-text-primary'
                }`
              }
            >
              <Database className="w-5 h-5 mr-3" />
              Data Pipeline
            </NavLink>
            <NavLink
              to="/settings"
              onClick={closeMenu}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 md:py-2 rounded-md transition-colors ${
                  isActive 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'text-text-secondary hover:bg-muted hover:text-text-primary'
                }`
              }
            >
              <Settings className="w-5 h-5 mr-3" />
              Settings
            </NavLink>
          </nav>
        </div>

        <div className="p-4 border-t border-border text-xs text-text-secondary shrink-0">
          <p>Mock Portfolio Environment</p>
          <p>Local Mode Active</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden pt-16 md:pt-0">
        <header className="hidden md:flex h-16 border-b border-border bg-white/80 backdrop-blur-sm items-center justify-between px-8 shrink-0">
          <h1 className="font-semibold text-text-primary">AI Knowledge Base</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-text-secondary bg-muted px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span>Systems Operational</span>
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto bg-background/50 flex flex-col">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
