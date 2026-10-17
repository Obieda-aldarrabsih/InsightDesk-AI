import React from 'react';
import { cn } from '@/lib/utils';

interface CitationChipProps {
  id: number;
  documentName: string;
  relevanceScore?: number;
  onClick: () => void;
}

export const CitationChip: React.FC<CitationChipProps> = ({ id, documentName, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2",
        "bg-citation-bg text-citation-text hover:bg-opacity-80 border border-transparent cursor-pointer"
      )}
      title="View Source Document"
    >
      [{id}] {documentName}
    </button>
  );
};
