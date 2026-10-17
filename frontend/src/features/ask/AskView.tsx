import React, { useState } from 'react';
import { AnswerCard } from '@/components/answer/AnswerCard';
import { type ConfidenceTier } from '@/components/answer/ConfidenceBadge';
import { Send } from 'lucide-react';

export const AskView = () => {
  const [question, setQuestion] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [isAsking, setIsAsking] = useState(false);

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    // Simulate API call for the portfolio MVP demo
    const newQ = question;
    setQuestion("");
    setIsAsking(true);

    // Add an initial pending response to history
    const tempId = Date.now();
    setHistory(prev => [...prev, {
      id: tempId,
      question: newQ,
      answerText: "",
      isStreaming: true,
      confidenceTier: "high",
      citations: []
    }]);

    // Mock an SSE response delay
    setTimeout(() => {
      setHistory(prev => prev.map(item => {
        if (item.id === tempId) {
          // Determine mock response based on question
          if (newQ.toLowerCase().includes("color") || newQ.toLowerCase().includes("ceo")) {
            // The Negative Case Demo (Out of scope)
            return {
              ...item,
              answerText: "I don't have enough information to answer this confidently.",
              isStreaming: false,
              confidenceTier: "low" as ConfidenceTier,
              citations: []
            };
          } else {
            // The Positive Case Demo (Grounded)
            return {
              ...item,
              answerText: "Based on the provided company policies, our standard refund period is 30 days from the date of purchase. Ensure all items are in their original packaging [1]. Note that digital services are non-refundable after activation [2].",
              isStreaming: false,
              confidenceTier: "high" as ConfidenceTier,
              citations: [
                { id: 1, chunk_id: "c1", document_name: "Refund Policy 2024.pdf", text: "..." },
                { id: 2, chunk_id: "c2", document_name: "Terms of Service.pdf", text: "..." }
              ]
            };
          }
        }
        return item;
      }));
      setIsAsking(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-background relative">
      {/* Chat History Area */}
      <main className="flex-1 overflow-y-auto p-3 md:p-6 scroll-smooth">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-text-secondary max-w-lg mx-auto text-center space-y-4 md:space-y-6 p-4">
            <h2 className="text-xl md:text-2xl font-bold text-primary">Every answer, grounded.</h2>
            <p className="text-sm md:text-base">Try the live demo. Ask a supported question like <strong>"What is our refund policy?"</strong> or test the AI safety guardrails by asking <strong>"What is the CEO's favorite color?"</strong>.</p>
          </div>
        ) : (
          <div className="space-y-4 md:space-y-6 pb-20">
            {history.map(item => (
              <AnswerCard
                key={item.id}
                question={item.question}
                answerText={item.answerText}
                confidenceTier={item.confidenceTier}
                citations={item.citations}
                isStreaming={item.isStreaming}
              />
            ))}
          </div>
        )}
      </main>

      {/* Input Area */}
      <footer className="p-3 md:p-4 bg-surface border-t border-border shrink-0 pb-4 md:pb-8">
        <form onSubmit={handleAsk} className="max-w-4xl mx-auto relative flex items-center">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask anything about our policies..."
            className="w-full h-12 md:h-14 pl-4 md:pl-6 pr-12 md:pr-14 rounded-full border border-border bg-background text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent shadow-sm transition-all text-sm md:text-[15px]"
            disabled={isAsking}
          />
          <button
            type="submit"
            disabled={isAsking || !question.trim()}
            className="absolute right-1.5 md:right-2 p-2.5 md:p-3 bg-primary text-white rounded-full hover:bg-opacity-90 disabled:opacity-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </footer>
    </div>
  );
};
