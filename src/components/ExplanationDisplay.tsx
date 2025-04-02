
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from '@/lib/utils';
import { Lightbulb } from 'lucide-react';

interface ExplanationDisplayProps {
  explanation: string;
  isLoading: boolean;
  className?: string;
}

const ExplanationDisplay: React.FC<ExplanationDisplayProps> = ({ explanation, isLoading, className }) => {
  // Function to convert markdown to HTML (basic implementation)
  const renderMarkdown = (text: string) => {
    if (!text) return null;
    
    // Split by lines
    const lines = text.split('\n');
    
    // Process each line
    return (
      <div className="space-y-4">
        {lines.map((line, i) => {
          // Handle headers
          if (line.startsWith('# ')) {
            return <h1 key={i} className="text-2xl font-bold">{line.slice(2)}</h1>;
          }
          if (line.startsWith('## ')) {
            return <h2 key={i} className="text-xl font-bold">{line.slice(3)}</h2>;
          }
          if (line.startsWith('### ')) {
            return <h3 key={i} className="text-lg font-bold">{line.slice(4)}</h3>;
          }
          
          // Handle bullet points
          if (line.startsWith('- ')) {
            return <li key={i} className="ml-4">{line.slice(2)}</li>;
          }
          
          // Handle code blocks or other special formatting
          if (line.trim() === '') {
            return <div key={i} className="h-2"></div>;
          }
          
          // Default paragraph
          return <p key={i}>{line}</p>;
        })}
      </div>
    );
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <div className="rounded-full p-3 bg-primary/10">
              <Lightbulb className="w-8 h-8 text-primary animate-pulse-slow" />
            </div>
            <p className="text-muted-foreground">AI is analyzing your code...</p>
          </div>
        ) : explanation ? (
          <div className="prose prose-invert max-w-none">
            {renderMarkdown(explanation)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 space-y-4 text-muted-foreground">
            <div className="rounded-full p-3 bg-muted/20">
              <Lightbulb className="w-8 h-8" />
            </div>
            <p>Code explanation will appear here</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExplanationDisplay;
