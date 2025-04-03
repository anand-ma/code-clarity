import React, { useState, useEffect } from 'react';
import Editor from 'react-simple-code-editor';
import { cn } from '@/lib/utils';
import { ScrollArea } from "@/components/ui/scroll-area";

// Import Prism core set first
import Prism from 'prismjs';
import 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css';

// Import markup and templating (required by many other languages)
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-markup-templating';

// Import JSX/TSX related languages
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-tsx';

// Import other languages
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-sass';
import 'prismjs/components/prism-less';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-bash';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  language?: string;
}

const LANGUAGE_MAP: { [key: string]: string } = {
  'js': 'javascript',
  'jsx': 'jsx',
  'ts': 'typescript',
  'tsx': 'tsx',
  'py': 'python',
  'java': 'java',
  'c': 'c',
  'cpp': 'cpp',
  'cs': 'csharp',
  'rb': 'ruby',
  'rs': 'rust',
  'go': 'go',
  'php': 'php',
  'sql': 'sql',
  'html': 'markup',
  'xml': 'markup',
  'css': 'css',
  'scss': 'sass',
  'sass': 'sass',
  'less': 'less',
  'json': 'json',
  'yml': 'yaml',
  'yaml': 'yaml',
  'md': 'markdown',
  'sh': 'bash',
  'bash': 'bash'
};

const detectLanguage = (code: string): string => {
  // Simple language detection based on file extension or content
  const firstLine = code.split('\n')[0].toLowerCase();
  
  // Check file extension in the first line (e.g. from comments or imports)
  if (firstLine.includes('.ts') && !firstLine.includes('.tsx')) return 'typescript';
  if (firstLine.includes('.tsx')) return 'tsx';
  
  // Check for shebang
  if (firstLine.startsWith('#!/')) {
    if (firstLine.includes('python')) return 'python';
    if (firstLine.includes('node')) return 'javascript';
    if (firstLine.includes('bash') || firstLine.includes('sh')) return 'bash';
    if (firstLine.includes('ruby')) return 'ruby';
  }

  // Check for TypeScript-specific patterns
  if (
    code.includes('interface ') ||
    code.includes('type ') ||
    code.includes(': string') ||
    code.includes(': number') ||
    code.includes(': boolean') ||
    code.includes(': Promise<') ||
    /import.*from ['"]@.*['"]/.test(code) // Matches package imports
  ) {
    return 'typescript';
  }

  // Check for common language patterns
  if (code.includes('<?php')) return 'php';
  if (code.includes('<html') || code.includes('<!DOCTYPE')) return 'markup';
  if (code.includes('import React') || code.includes('React.')) return 'tsx';
  if (code.includes('package main')) return 'go';
  
  // Default to JavaScript if no other language is detected
  return 'javascript';
};

// Initialize Prism
if (typeof window !== 'undefined') {
  Prism.manual = true;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  value, 
  onChange, 
  placeholder = "Paste or type your code here...", 
  className,
  language: providedLanguage 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const lines = value.split('\n');
  const detectedLanguage = providedLanguage || detectLanguage(value);

  useEffect(() => {
    // Force Prism to initialize languages
    if (typeof window !== 'undefined') {
      Prism.highlightAll();
    }
  }, [value, detectedLanguage]);
  
  // Handle tab key in editor
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);

      // Move cursor position after the inserted tab
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
  };

  const highlightCode = (code: string) => {
    try {
      if (!code) return ''; // Handle empty code
      
      // Get the grammar for the detected language
      const grammar = Prism.languages[detectedLanguage] || Prism.languages.javascript;
      
      if (!grammar) {
        console.warn(`Language '${detectedLanguage}' not found, falling back to plain text`);
        return code;
      }

      // Force a re-highlight
      const highlighted = Prism.highlight(
        code,
        grammar,
        detectedLanguage
      );

      return highlighted;
    } catch (error) {
      console.error('Error highlighting code:', error);
      return code; // Fallback to plain text on error
    }
  };

  return (
    <div className={cn("relative rounded-md border bg-editor-bg h-[550px]", className)}>
      <ScrollArea className="h-full rounded-md">
        <div className="flex h-full min-h-full">
          {/* Line numbers column */}
          <div className="flex-none w-10 bg-editor-line border-r border-muted text-xs text-muted-foreground py-3 text-center">
            {lines.map((_, i) => (
              <div key={i} className="h-6 flex items-center justify-center">{i + 1}</div>
            ))}
          </div>
          
          {/* Code editor area */}
          <div className="flex-1">
            <Editor
              value={value}
              onValueChange={onChange}
              onKeyDown={handleKeyDown}
              highlight={highlightCode}
              placeholder={placeholder}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={cn(
                "font-mono text-sm w-full h-full",
                "prose prose-sm prose-slate dark:prose-invert",
                isFocused ? "border-primary" : "border-muted"
              )}
              style={{
                fontFamily: '"Roboto Mono", monospace',
                minHeight: '100%',
                backgroundColor: 'transparent',
                whiteSpace: 'pre',
                overflowWrap: 'normal',
                padding: '12px'
              }}
              textareaClassName="focus:outline-none bg-transparent"
            />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default CodeEditor;
