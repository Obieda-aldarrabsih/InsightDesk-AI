import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { FileText, X } from 'lucide-react';

interface CitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  citation: {
    id: string;
    document_name: string;
    content: string;
    relevance_score: number;
  } | null;
}

export const CitationModal: React.FC<CitationModalProps> = ({ isOpen, onClose, citation }) => {
  if (!citation) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-in fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-2xl max-h-[85vh] bg-card border border-border rounded-xl shadow-2xl z-50 flex flex-col animate-in fade-in zoom-in-95 duration-200">
          
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-md">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <Dialog.Title className="text-lg font-semibold text-text-primary">
                  Source Document Viewer
                </Dialog.Title>
                <Dialog.Description className="text-sm text-text-secondary">
                  {citation.document_name} • Chunk ID: {citation.id}
                </Dialog.Description>
              </div>
            </div>
            <Dialog.Close className="p-2 rounded-md hover:bg-muted transition-colors text-text-secondary hover:text-text-primary">
              <X className="w-5 h-5" />
            </Dialog.Close>
          </div>

          <div className="p-6 overflow-y-auto flex-1">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Extracted Context
              </span>
              <span className="text-xs font-mono bg-muted px-2 py-1 rounded text-text-secondary">
                Similarity: {(citation.relevance_score * 100).toFixed(1)}%
              </span>
            </div>
            
            <div className="relative">
              {/* Fake surrounding text */}
              <div className="text-sm text-text-secondary/50 font-serif leading-relaxed line-clamp-3 mb-2 blur-[1px] select-none">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </div>
              
              {/* Highlighted actual chunk */}
              <div className="text-sm text-text-primary font-serif leading-relaxed bg-yellow-500/20 border-l-4 border-yellow-500 pl-4 py-2 my-4 rounded-r-md">
                {citation.content}
              </div>

              {/* Fake surrounding text */}
              <div className="text-sm text-text-secondary/50 font-serif leading-relaxed line-clamp-3 mt-2 blur-[1px] select-none">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </div>
            </div>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
