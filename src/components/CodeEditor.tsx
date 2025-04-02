
import React, { useState, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { cn } from '@/lib/utils';
import { ScrollArea } from "@/components/ui/scroll-area";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange, placeholder = "Paste or type your code here...", className }) => {
  const [isFocused, setIsFocused] = useState(false);
  const lines = value.split('\n');
  
  // Handle tab key in textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
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

  return (
    <div className={cn("relative rounded-md border bg-editor-bg", className)}>
      <div className="flex">
        {/* Line numbers column */}
        <div className="flex-none w-10 bg-editor-line border-r border-muted text-xs text-muted-foreground py-3">
          {lines.map((_, i) => (
            <div key={i} className="h-6 flex items-center justify-center">{i + 1}</div>
          ))}
        </div>
        
        {/* Code editor area */}
        <ScrollArea className="w-full h-full">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            className={cn(
              "font-mono text-sm min-h-[300px] w-full resize-none bg-transparent border-0 p-3 focus-visible:ring-0 focus-visible:ring-offset-0",
              isFocused ? "border-primary" : "border-muted"
            )}
            style={{ 
              whiteSpace: 'pre',
              overflowWrap: 'normal'
            }}
          />
        </ScrollArea>
      </div>
    </div>
  );
};

export default CodeEditor;
