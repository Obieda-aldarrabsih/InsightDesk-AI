import { useState } from 'react';
import * as Slider from '@radix-ui/react-slider';
import { Save, ShieldAlert, Sliders, MessageSquareWarning } from 'lucide-react';

export const SettingsView = () => {
  const [threshold, setThreshold] = useState([0.75]);
  const [chunkSize, setChunkSize] = useState([1000]);
  const [strictMode, setStrictMode] = useState(true);

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6 md:space-y-8 w-full">
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-2">AI Configuration & Guardrails</h2>
        <p className="text-sm md:text-base text-text-secondary">Fine-tune the RAG pipeline parameters and system instructions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Left Column: Retrieval Settings */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center mb-6">
              <Sliders className="w-5 h-5 text-primary mr-2" />
              <h3 className="font-semibold text-text-primary">Retrieval Parameters</h3>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-text-primary">Cosine Similarity Threshold</label>
                  <span className="text-sm text-text-secondary font-mono">{threshold[0].toFixed(2)}</span>
                </div>
                <Slider.Root 
                  className="relative flex items-center select-none touch-none w-full h-5" 
                  value={threshold} 
                  onValueChange={setThreshold} 
                  max={1} 
                  step={0.01}
                >
                  <Slider.Track className="bg-muted relative grow rounded-full h-2">
                    <Slider.Range className="absolute bg-primary rounded-full h-full" />
                  </Slider.Track>
                  <Slider.Thumb className="block w-4 h-4 bg-background border-2 border-primary rounded-full hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors" />
                </Slider.Root>
                <p className="text-xs text-text-secondary mt-2">Documents with similarity below this score will be ignored.</p>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-text-primary">Chunk Size (Tokens)</label>
                  <span className="text-sm text-text-secondary font-mono">{chunkSize}</span>
                </div>
                <Slider.Root 
                  className="relative flex items-center select-none touch-none w-full h-5" 
                  value={chunkSize} 
                  onValueChange={setChunkSize} 
                  min={256}
                  max={2048} 
                  step={128}
                >
                  <Slider.Track className="bg-muted relative grow rounded-full h-2">
                    <Slider.Range className="absolute bg-primary rounded-full h-full" />
                  </Slider.Track>
                  <Slider.Thumb className="block w-4 h-4 bg-background border-2 border-primary rounded-full hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors" />
                </Slider.Root>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center mb-6">
              <ShieldAlert className="w-5 h-5 text-red-500 mr-2" />
              <h3 className="font-semibold text-text-primary">Safety & Grounding</h3>
            </div>
            
            <label className="flex items-start space-x-3 cursor-pointer group">
              <div className="relative flex items-center justify-center mt-0.5">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={strictMode}
                  onChange={() => setStrictMode(!strictMode)}
                />
                <div className={`w-10 h-5 rounded-full transition-colors ${strictMode ? 'bg-green-500' : 'bg-muted'}`}></div>
                <div className={`absolute w-4 h-4 bg-white rounded-full shadow transition-transform ${strictMode ? 'translate-x-2.5' : '-translate-x-2.5'}`}></div>
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">Strict Grounding Mode</p>
                <p className="text-xs text-text-secondary mt-1">If enabled, the LLM will refuse to answer questions that cannot be answered using the retrieved context. Prevents hallucination.</p>
              </div>
            </label>
          </div>
        </div>

        {/* Right Column: Prompt Settings */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center mb-6">
            <MessageSquareWarning className="w-5 h-5 text-primary mr-2" />
            <h3 className="font-semibold text-text-primary">System Prompt</h3>
          </div>
          
          <div className="flex-1 flex flex-col">
            <label className="text-sm font-medium text-text-primary mb-2">Base Instructions</label>
            <textarea 
              className="flex-1 w-full bg-background border border-border rounded-md p-4 text-sm text-text-primary font-mono focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none min-h-[200px]"
              defaultValue={`You are InsightDesk AI, a professional corporate assistant.
Your goal is to provide highly accurate answers based ONLY on the provided context.

RULES:
1. If the answer is not in the context, say "I don't have enough information to answer that."
2. Always cite your sources using the [DocID] format.
3. Be concise and professional.`}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-border">
        <button className="flex items-center px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors">
          <Save className="w-4 h-4 mr-2" />
          Save Configuration
        </button>
      </div>
    </div>
  );
};
