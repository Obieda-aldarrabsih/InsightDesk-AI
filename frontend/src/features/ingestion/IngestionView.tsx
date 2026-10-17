import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, CheckCircle2, Loader2, Database, BrainCircuit, FileSearch } from 'lucide-react';

const steps = [
  { id: 'extract', label: 'Extracting Text & Metadata', icon: FileSearch },
  { id: 'chunk', label: 'Semantic Text Chunking', icon: FileText },
  { id: 'embed', label: 'Generating Dense Embeddings', icon: BrainCircuit },
  { id: 'store', label: 'Indexing in pgvector', icon: Database },
];

export const IngestionView = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'done'>('idle');
  const [currentStep, setCurrentStep] = useState(0);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      startProcessing(e.dataTransfer.files[0]);
    }
  };

  const startProcessing = (file: File) => {
    setFile(file);
    setStatus('processing');
    setCurrentStep(0);

    // Mock the processing timeline
    steps.forEach((_, index) => {
      setTimeout(() => {
        setCurrentStep(index + 1);
        if (index === steps.length - 1) {
          setTimeout(() => setStatus('done'), 1000);
        }
      }, (index + 1) * 1500); // 1.5s per step
    });
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto w-full">
      <div className="mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-2">Data Ingestion Pipeline</h2>
        <p className="text-sm md:text-base text-text-secondary">Upload documents to expand your AI Knowledge Base. The system will automatically chunk, embed, and index your data.</p>
      </div>

      {status === 'idle' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`
            border-2 border-dashed rounded-xl p-8 md:p-12 text-center transition-colors
            ${isDragging ? 'border-primary bg-primary/5' : 'border-border bg-card'}
          `}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
            <UploadCloud className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">Drag & Drop Documents</h3>
          <p className="text-text-secondary mb-6">Supports PDF, DOCX, TXT, and Markdown up to 50MB.</p>
          <button 
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
            onClick={() => startProcessing(new File([""], "Employee_Handbook_2024.pdf"))}
          >
            Or Browse Files
          </button>
        </motion.div>
      )}

      {(status === 'processing' || status === 'done') && (
        <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
          <div className="flex items-center mb-8 pb-6 border-b border-border">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">{file?.name || 'Document.pdf'}</h3>
              <p className="text-sm text-text-secondary">{status === 'done' ? 'Successfully Indexed' : 'Processing Pipeline Active'}</p>
            </div>
            {status === 'done' && (
              <div className="ml-auto flex items-center text-green-500 bg-green-500/10 px-4 py-1.5 rounded-full text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Completed
              </div>
            )}
          </div>

          <div className="space-y-6">
            {steps.map((step, index) => {
              const isPast = currentStep > index;
              const isCurrent = currentStep === index && status === 'processing';
              const isPending = currentStep < index;

              return (
                <div key={step.id} className="flex items-start">
                  <div className="relative flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 
                      ${isPast ? 'bg-primary border-primary text-primary-foreground' : 
                        isCurrent ? 'border-primary text-primary bg-background' : 
                        'border-border bg-background text-text-secondary'}`}
                    >
                      {isPast ? <CheckCircle2 className="w-5 h-5" /> : 
                       isCurrent ? <Loader2 className="w-5 h-5 animate-spin" /> : 
                       <step.icon className="w-4 h-4" />}
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`absolute top-10 left-1/2 -ml-px w-0.5 h-full -mb-6 
                        ${isPast ? 'bg-primary' : 'bg-border'}`} 
                      />
                    )}
                  </div>
                  <div className="ml-6 pt-1.5 flex-1">
                    <h4 className={`text-sm font-semibold ${isPending ? 'text-text-secondary' : 'text-text-primary'}`}>
                      {step.label}
                    </h4>
                    {isCurrent && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-2 text-xs text-text-secondary"
                      >
                        {index === 0 && 'Parsing PDF structure and extracting raw tokens...'}
                        {index === 1 && 'Applying LangChain RecursiveCharacterTextSplitter (Size: 1000, Overlap: 200)...'}
                        {index === 2 && 'Calling OpenAI API for vector generation...'}
                        {index === 3 && 'Executing INSERT INTO chunks (embedding) VALUES...'}
                      </motion.div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <AnimatePresence>
            {status === 'done' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-10 pt-6 border-t border-border flex justify-end"
              >
                <button 
                  onClick={() => setStatus('idle')}
                  className="px-4 py-2 border border-border rounded-md text-sm font-medium hover:bg-muted transition-colors"
                >
                  Upload Another File
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
