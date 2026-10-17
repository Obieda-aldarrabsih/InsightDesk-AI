import React, { useState } from 'react';
import { ConfidenceBadge, type ConfidenceTier } from './ConfidenceBadge';
import { CitationChip } from './CitationChip';
import { CitationModal } from './CitationModal';
import { cn } from '@/lib/utils';
import { Bot, ThumbsUp, ThumbsDown } from 'lucide-react';

interface CitationData {
  id: number;
  chunk_id: string;
  document_name: string;
  text: string;
  relevance_score?: number;
}

interface AnswerCardProps {
  question: string;
  answerText: string;
  confidenceTier: ConfidenceTier;
  citations: CitationData[];
  isStreaming?: boolean;
}

export const AnswerCard: React.FC<AnswerCardProps> = ({
  question,
  answerText,
  confidenceTier,
  citations,
  isStreaming = false
}) => {
  const [selectedCitation, setSelectedCitation] = useState<CitationData | null>(null);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-3 md:gap-4 my-2 md:my-6">
      {/* User Question */}
      <div className="self-end bg-primary text-primary-foreground px-4 py-2.5 md:py-3 rounded-2xl rounded-tr-sm max-w-[90%] md:max-w-[80%] shadow-sm">
        <p className="text-[14px] md:text-[15px] leading-relaxed">{question}</p>
      </div>

      {/* AI Answer Card */}
      <div className={cn(
        "relative flex flex-col self-start bg-surface border border-border rounded-2xl p-4 md:p-6 shadow-sm w-full md:max-w-[90%]",
        "border-l-4 border-l-accent" // AI-content marker
      )}>
        {/* Header */}
        <div className="flex justify-between items-center mb-3 md:mb-4">
          <div className="flex items-center gap-1.5 md:gap-2 text-primary font-semibold">
            <Bot className="w-4 h-4 md:w-5 md:h-5 text-accent" />
            <span className="text-sm md:text-base">InsightDesk AI</span>
          </div>
          {!isStreaming && <ConfidenceBadge tier={confidenceTier} />}
        </div>

        {/* Answer Content */}
        <div className="prose prose-sm max-w-none text-text-primary text-[15px] leading-relaxed mb-6">
          {/* Note: In a real implementation this would parse markdown and convert [1] into interactive highlights */}
          {answerText || (isStreaming ? "Thinking..." : "No answer provided.")}
          {isStreaming && (
            <span className="inline-flex ml-1">
               <span className="animate-pulse">.</span>
               <span className="animate-pulse delay-75">.</span>
               <span className="animate-pulse delay-150">.</span>
            </span>
          )}
        </div>

        {/* Citations Footer */}
        {citations.length > 0 && !isStreaming && (
          <div className="mt-auto pt-4 border-t border-border">
            <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Sources</h4>
            <div className="flex flex-wrap gap-2">
              {citations.map((cit, idx) => (
                <CitationChip 
                  key={cit.chunk_id} 
                  id={idx + 1} 
                  documentName={cit.document_name} 
                  onClick={() => setSelectedCitation(cit)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Feedback (only if done) */}
        {!isStreaming && (
          <div className="absolute -right-12 bottom-4 flex flex-col gap-2">
            <button className="p-2 bg-surface border border-border rounded-full text-text-secondary hover:text-primary transition-colors shadow-sm">
              <ThumbsUp className="w-4 h-4" />
            </button>
            <button className="p-2 bg-surface border border-border rounded-full text-text-secondary hover:text-danger transition-colors shadow-sm">
              <ThumbsDown className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <CitationModal 
        isOpen={!!selectedCitation}
        onClose={() => setSelectedCitation(null)}
        citation={selectedCitation ? {
          id: selectedCitation.chunk_id,
          document_name: selectedCitation.document_name,
          content: selectedCitation.text,
          relevance_score: selectedCitation.relevance_score || 0.88
        } : null}
      />
    </div>
  );
};
