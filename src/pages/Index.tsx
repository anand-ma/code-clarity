import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FileCode, Cpu, DownloadCloud, FileDown, Link as LinkIcon, FileOutput } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import CodeEditor from "@/components/CodeEditor";
import ExplanationDisplay, { ExplanationRef } from "@/components/ExplanationDisplay";
import { analyzeCode, initializeGemini } from "@/services/aiService";
import { Input } from "@/components/ui/input";
import { convertGithubUrlToRaw } from "@/utils/urlUtils";
import { ApiKeyDialog } from "@/components/api-key-dialog";

const Index = () => {
  const [code, setCode] = useState(() => {
    // Check if localStorage is available (for SSR/build compatibility)
    if (typeof window !== 'undefined') {
      return localStorage.getItem("editorContent") || "";
    }
    return "";
  });
  const [explanation, setExplanation] = useState(() => {
    // Check if localStorage is available
    if (typeof window !== 'undefined') {
      return localStorage.getItem("explanationText") || "";
    }
    return "";
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState("editor");
  const [fileUrl, setFileUrl] = useState("");
  const [isUrlLoading, setIsUrlLoading] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("gemini-api-key") || "");
  const { toast } = useToast();
  const explanationRef = useRef<ExplanationRef>(null);

  useEffect(() => {
    // Check if localStorage is available
    if (typeof window !== 'undefined') {
      localStorage.setItem("editorContent", code);
    }
  }, [code]);

  useEffect(() => {
    // Check if localStorage is available
    if (typeof window !== 'undefined') {
      localStorage.setItem("explanationText", explanation);
    }
  }, [explanation]);

  useEffect(() => {
    if (apiKey) {
      try {
        initializeGemini(apiKey);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to initialize Gemini API. Please check your API key.",
          variant: "destructive",
        });
      }
    }
  }, [apiKey, toast]);

  const handleApiKeyChange = (key: string) => {
    setApiKey(key);
    localStorage.setItem("gemini-api-key", key);
  };

  const handleAnalyze = async () => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Gemini API key to analyze code.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await analyzeCode(code);
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
        return;
      }
      setExplanation(result.text);
      setActiveTab("explanation");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFetchSample = async () => {
    setIsAnalyzing(true);
    try {
      // Fetch the sample file
      const response = await fetch('https://raw.githubusercontent.com/anand-ma/kathai-gen/refs/heads/main/kathai-gen.py');
      if (!response.ok) {
        throw new Error('Failed to fetch sample file');
      }
      const sampleCode = await response.text();
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

  const handleFetchFromUrl = async () => {
    if (!fileUrl.trim()) {
      toast({
        title: "No URL provided",
        description: "Please enter a URL to fetch from.",
        variant: "destructive"
      });
      return;
    }

    setIsUrlLoading(true);
    try {
      const rawUrl = convertGithubUrlToRaw(fileUrl);
      console.log("Fetching from:", rawUrl);
      
      const response = await fetch(rawUrl, {
        method: 'GET',
        headers: {
          'Accept': 'text/plain',
        },
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const fetchedCode = await response.text();
      if (!fetchedCode.trim()) {
        throw new Error('No content received from the URL');
      }

      setCode(fetchedCode);
      toast({
        title: "Code Fetched Successfully",
        description: `Code from ${fileUrl} has been loaded into the editor.`
      });
    } catch (error) {
      console.error("Error fetching code:", error);
      toast({
        title: "Failed to Fetch Code",
        description: error instanceof Error ? error.message : "Could not load the code from the provided URL. Please check the URL and try again.",
        variant: "destructive"
      });
    } finally {
      setIsUrlLoading(false);
    }
  };

  const handleExportPDF = () => {
    if (explanationRef.current) {
      explanationRef.current.exportToPdf();
    }
  };

  return <div className="container p-4 py-6 md:py-10 max-w-7xl mx-auto">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Code Clarity</h1>
              <p className="text-sm text-muted-foreground">Powered by AI ❤️ </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ApiKeyDialog apiKey={apiKey} onApiKeyChange={handleApiKeyChange} />
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
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <div className="flex flex-col space-y-2 w-full">
                  <Input
                    placeholder="Enter file URL (e.g., GitHub raw URL)"
                    value={fileUrl}
                    onChange={(e) => setFileUrl(e.target.value)}
                    className="w-full"
                  />
                  <Button 
                    onClick={handleFetchFromUrl} 
                    disabled={isUrlLoading || !fileUrl.trim()}
                    className="w-full"
                  >
                    {isUrlLoading ? (
                      <>
                        <FileDown className="h-4 w-4 mr-2 animate-spin" />
                        Fetching...
                      </>
                    ) : (
                      <>
                        <LinkIcon className="h-4 w-4 mr-2" />
                        Fetch
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <CodeEditor value={code} onChange={setCode} className="min-h-[300px]" />
              <div className="flex flex-col gap-2">
                <Button variant="outline" onClick={handleFetchSample} disabled={isAnalyzing} className="w-full text-sm">
                  <DownloadCloud className="h-4 w-4 mr-2" />
                  Load Sample
                </Button>
                <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full text-sm">
                  {isAnalyzing ? <>
                      <Cpu className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </> : <>
                      <Cpu className="h-4 w-4 mr-2" />
                      Analyze with Gemini
                    </>}
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="explanation" className="mt-4">
            <div className="flex justify-end mb-2">
              {explanation && (
                <Button 
                  onClick={handleExportPDF}
                  variant="ghost" 
                  size="sm"
                  className="hover:bg-primary/10 flex items-center text-xs"
                >
                  <FileOutput className="h-3.5 w-3.5 mr-1" />
                  Export PDF
                </Button>
              )}
            </div>
            <ExplanationDisplay 
              explanation={explanation} 
              isLoading={isAnalyzing} 
              className="min-h-[300px]" 
              ref={explanationRef}
            />
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
                Paste your code, load a sample, or fetch from URL
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-2">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter file URL (e.g., GitHub raw URL)"
                    value={fileUrl}
                    onChange={(e) => setFileUrl(e.target.value)}
                    className="flex-grow"
                  />
                  <Button 
                    onClick={handleFetchFromUrl} 
                    disabled={isUrlLoading || !fileUrl.trim()}
                    className="whitespace-nowrap"
                  >
                    {isUrlLoading ? (
                      <>
                        <FileDown className="h-4 w-4 mr-2 animate-spin" />
                        Fetching...
                      </>
                    ) : (
                      <>
                        <LinkIcon className="h-4 w-4 mr-2" />
                        Fetch
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <CodeEditor value={code} onChange={setCode} className="min-h-[500px]" />
            </CardContent>
            <CardFooter className="flex gap-2 justify-between">
              <Button variant="outline" onClick={handleFetchSample} disabled={isAnalyzing}>
                <DownloadCloud className="h-4 w-4 mr-2" />
                Load Sample
              </Button>
              <Button onClick={handleAnalyze} disabled={isAnalyzing}>
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
              <CardDescription className="flex justify-between items-center">
                <span>Understanding what your code does</span>
                {explanation && (
                  <Button 
                    onClick={handleExportPDF}
                    variant="ghost" 
                    size="sm"
                    className="hover:bg-primary/10 flex items-center text-xs"
                  >
                    <FileOutput className="h-3.5 w-3.5 mr-1" />
                    Export PDF
                  </Button>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ExplanationDisplay 
                explanation={explanation} 
                isLoading={isAnalyzing} 
                className="h-full" 
                ref={explanationRef}
              />
            </CardContent>
          </Card>
        </div>
      </div>
      
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>© 2025 Code Clarity. All rights reserved.</p>
        <p className="mt-2">Made with ❤️ by Funnylabs</p>
      </footer>
    </div>;
};
export default Index;
