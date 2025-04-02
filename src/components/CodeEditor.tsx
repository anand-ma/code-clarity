
import React, { useState, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { cn } from '@/lib/utils';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange, placeholder = "Paste or type your code here...", className }) => {
  const [isFocused, setIsFocused] = useState(false);

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
      <div className="absolute top-0 left-0 w-8 h-full bg-editor-line border-r border-muted flex flex-col items-center pt-3 text-xs text-muted-foreground">
        {value.split('\n').map((_, i) => (
          <div key={i} className="h-6 w-full text-center">{i + 1}</div>
        ))}
      </div>
      
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        className={cn(
          "font-mono text-sm min-h-[300px] resize-none bg-transparent pl-10 pr-4 py-3 focus-visible:ring-1 focus-visible:ring-ring",
          isFocused ? "border-primary" : "border-muted"
        )}
      />
    </div>
  );
};

export default CodeEditor;
