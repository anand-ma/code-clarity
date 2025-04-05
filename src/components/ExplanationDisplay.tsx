import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
// @ts-expect-error - html2pdf has no types
import html2pdf from 'html2pdf.js';

// Define custom types for the markdown components
type CodeComponentProps = {
  className?: string;
  children: React.ReactNode;
  inline?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: unknown;
};

export interface ExplanationRef {
  exportToPdf: () => void;
}

interface ExplanationDisplayProps {
  explanation: string;
  isLoading?: boolean;
  className?: string;
}

const ExplanationDisplay = forwardRef<ExplanationRef, ExplanationDisplayProps>(
  ({ explanation, isLoading, className = "" }, ref) => {
    const contentRef = useRef<HTMLDivElement>(null);
    
    // Export function to be exposed to parent components
    const exportToPdf = () => {
      if (!contentRef.current || !explanation) return;
      
      const element = contentRef.current;
      
      // Create a clone of the element with absolute height (not scrollable)
      const clonedElement = element.cloneNode(true) as HTMLElement;
      clonedElement.style.height = 'auto';
      clonedElement.style.overflow = 'visible';
      
      // Create temporary container for PDF generation
      const tempContainer = document.createElement('div');
      tempContainer.appendChild(clonedElement);
      document.body.appendChild(tempContainer);
      
      // Configure PDF options
      const opt = {
        margin: 10,
        filename: 'code-explanation.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { 
          scale: 2,
          useCORS: true, 
          backgroundColor: '#121212',
          logging: false,
          letterRendering: true,
          allowTaint: true
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true
        }
      };
      
      // Generate PDF
      html2pdf().set(opt).from(clonedElement).save().then(() => {
        // Clean up temporary elements
        document.body.removeChild(tempContainer);
      });
    };
  
    // Make the export function available via the ref
    useImperativeHandle(ref, () => ({
      exportToPdf
    }));
  
    return (
      <div 
        ref={contentRef} 
        className="h-[650px] overflow-y-auto bg-editor-bg rounded-md p-4"
      >
        <div className="prose prose-invert max-w-none dark:prose-invert">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // @ts-expect-error - ReactMarkdown components type mismatch
              code: ({ className, inline, children, ...props }: CodeComponentProps) => {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    // @ts-expect-error - SyntaxHighlighter style prop type issue
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{
                      margin: '1rem 0',
                      borderRadius: '0.375rem',
                      backgroundColor: '#1e1e1e',
                      padding: '1rem',
                    }}
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                    {children}
                  </code>
                );
              },
              h1: ({ children }) => (
                <h1 className="text-3xl font-bold mb-4 text-primary border-b border-primary/20 pb-2">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl font-bold mb-3 text-primary/90">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-bold mb-2 text-primary/80">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="mb-4 text-editor-text leading-relaxed">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-6 mb-4 space-y-2 text-editor-text">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-6 mb-4 space-y-2 text-editor-text">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="text-editor-text">
                  {children}
                </li>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-editor-text bg-primary/5 py-2 rounded-r">
                  {children}
                </blockquote>
              ),
              pre: ({ children }) => (
                <pre className="mb-4 bg-muted p-4 rounded-md overflow-x-auto">
                  {children}
                </pre>
              ),
              a: ({ href, children }) => (
                <a 
                  href={href} 
                  className="text-primary hover:text-primary/80 hover:underline" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
              strong: ({ children }) => (
                <strong className="text-primary font-semibold">
                  {children}
                </strong>
              ),
              em: ({ children }) => (
                <em className="text-primary/80 italic">
                  {children}
                </em>
              ),
            }}
          >
            {explanation}
          </ReactMarkdown>
        </div>
      </div>
    );
  }
);

export default ExplanationDisplay;
