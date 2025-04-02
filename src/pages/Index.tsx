import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Github, FileCode, Cpu, DownloadCloud } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import CodeEditor from "@/components/CodeEditor";
import ExplanationDisplay from "@/components/ExplanationDisplay";
import { analyzeCode } from "@/services/aiService";
const Index = () => {
  const [code, setCode] = useState("");
  const [explanation, setExplanation] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState("editor");
  const {
    toast
  } = useToast();
  const handleAnalyzeCode = async () => {
    if (!code.trim()) {
      toast({
        title: "No code to analyze",
        description: "Please enter some code in the editor.",
        variant: "destructive"
      });
      return;
    }
    setIsAnalyzing(true);
    try {
      const response = await analyzeCode(code);
      if (response.error) {
        toast({
          title: "Analysis Failed",
          description: response.error,
          variant: "destructive"
        });
        return;
      }
      setExplanation(response.text);
      toast({
        title: "Analysis Complete",
        description: "Your code has been analyzed successfully."
      });

      // Switch to the explanation tab on mobile
      if (window.innerWidth < 768) {
        setActiveTab("explanation");
      }
    } catch (error) {
      console.error("Error analyzing code:", error);
      toast({
        title: "Analysis Failed",
        description: "An error occurred while analyzing your code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  const handleFetchSample = async () => {
    setIsAnalyzing(true);
    try {
      // Simulate fetching the sample file
      await new Promise(resolve => setTimeout(resolve, 1000));
      const sampleCode = `https://raw.githubusercontent.com/anand-ma/kathai-gen/refs/heads/main/kathai-gen.py`;
      setCode(sampleCode);
      toast({
        title: "Sample Code Loaded",
        description: "kathai-gen.py sample code has been loaded into the editor."
      });
    } catch (error) {
      toast({
        title: "Failed to Load Sample",
        description: "Could not load the sample code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  return <div className="container p-4 py-6 md:py-10 max-w-7xl mx-auto">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Code Clarity</h1>
              <p className="text-sm text-muted-foreground">Powered by Google Gemini AI</p>
            </div>
          </div>
          
        </div>
        <Separator className="mt-6" />
      </header>
      
      {/* Mobile view - Tabs */}
      <div className="md:hidden mb-6">
        <Tabs defaultValue="editor" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="editor">Code</TabsTrigger>
            <TabsTrigger value="explanation">Explanation</TabsTrigger>
          </TabsList>
          <TabsContent value="editor" className="mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Code Editor</CardTitle>
                <CardDescription>
                  Paste your code or load the sample to analyze
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CodeEditor value={code} onChange={setCode} className="min-h-[300px]" />
              </CardContent>
              <CardFooter className="flex gap-2 justify-between">
                <Button variant="outline" onClick={handleFetchSample} disabled={isAnalyzing} className="text-sm">
                  <DownloadCloud className="h-4 w-4 mr-2" />
                  Load Sample
                </Button>
                <Button onClick={handleAnalyzeCode} disabled={isAnalyzing} className="text-sm">
                  {isAnalyzing ? <>
                      <Cpu className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </> : <>
                      <Cpu className="h-4 w-4 mr-2" />
                      Analyze with Gemini
                    </>}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="explanation" className="mt-4">
            <ExplanationDisplay explanation={explanation} isLoading={isAnalyzing} className="min-h-[300px]" />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Desktop view - Side by side */}
      <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Code Editor</CardTitle>
              <CardDescription>
                Paste your code or load the sample to analyze
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeEditor value={code} onChange={setCode} className="min-h-[500px]" />
            </CardContent>
            <CardFooter className="flex gap-2 justify-between">
              <Button variant="outline" onClick={handleFetchSample} disabled={isAnalyzing}>
                <DownloadCloud className="h-4 w-4 mr-2" />
                Load Sample
              </Button>
              <Button onClick={handleAnalyzeCode} disabled={isAnalyzing}>
                {isAnalyzing ? <>
                    <Cpu className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </> : <>
                    <Cpu className="h-4 w-4 mr-2" />
                    Analyze with Gemini
                  </>}
              </Button>
            </CardFooter>
          </Card>
        </div>
        <div>
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">AI Explanation</CardTitle>
              <CardDescription>
                Understanding what your code does
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ExplanationDisplay explanation={explanation} isLoading={isAnalyzing} className="h-full" />
            </CardContent>
          </Card>
        </div>
      </div>
      
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>This app simulates the use of Google Gemini AI for code analysis.</p>
        <p className="mt-1">In a production environment, it would connect to a real API.</p>
      </footer>
    </div>;
};
export default Index;