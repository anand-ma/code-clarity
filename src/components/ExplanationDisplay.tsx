import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ExplanationDisplayProps {
  explanation: string;
}

const ExplanationDisplay: React.FC<ExplanationDisplayProps> = ({ explanation }) => {
  return (
    <div className="h-[650px] overflow-y-auto bg-editor-bg rounded-md p-4">
      <div className="prose prose-invert max-w-none dark:prose-invert">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighlighter
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
};

export default ExplanationDisplay;
