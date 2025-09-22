import React, { useState, useRef, useEffect } from "react";
import { ChatButton } from "@/components/ui/chat-button";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Paperclip, 
  Mic, 
  Send,
  MicIcon,
  ChevronDown,
  Lightbulb,
  Microscope,
  Brain,
  Zap
} from "lucide-react";

export const ChatInterface = () => {
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchMode, setSearchMode] = useState("search");
  const [selectedModel, setSelectedModel] = useState("best");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const searchModes = {
    search: {
      label: "Search",
      description: "Fast answers to everyday questions",
      icon: Search,
      badge: "PRO"
    },
    research: {
      label: "Research", 
      description: "Deep research on any topic",
      icon: Microscope,
      badge: "PRO"
    },
    labs: {
      label: "Labs",
      description: "Create projects from scratch", 
      icon: Lightbulb,
      badge: "PRO"
    }
  };

  const models = {
    best: {
      label: "Best",
      description: "Optimal model selection",
      icon: Zap,
      badge: null
    },
    sonar: {
      label: "Sonar",
      description: "Fast web search model",
      icon: Brain,
      badge: null
    },
    "claude-sonnet-4": {
      label: "Claude Sonnet 4.0",
      description: "Advanced reasoning model",
      icon: Brain,
      badge: null
    },
    "claude-opus-4": {
      label: "Claude Opus 4.1 Thinking",
      description: "Most capable reasoning",
      icon: Brain,
      badge: "max"
    },
    "gpt-5": {
      label: "GPT-5",
      description: "OpenAI's latest model", 
      icon: Brain,
      badge: null
    },
    "o3-pro": {
      label: "o3-pro",
      description: "Advanced OpenAI model",
      icon: Brain,
      badge: "max"
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;

    setIsLoading(true);
    const currentMessage = message;
    setMessage("");
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Message sent",
        description: `"${currentMessage.substring(0, 50)}${currentMessage.length > 50 ? '...' : ''}"`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileAttach = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = ".txt,.pdf,.doc,.docx,.md,.py,.js,.html,.css,.json,.csv,.xlsx";
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      if (files.length > 0) {
        toast({
          title: "Files attached",
          description: `${files.length} file(s): ${files.map(f => f.name).join(", ")}`,
        });
      }
    };
    input.click();
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setMessage(transcript);
      };
      
      recognition.onerror = () => {
        toast({
          title: "Voice recognition error",
          description: "Please try again or type your message",
          variant: "destructive",
        });
        setIsListening(false);
      };
      
      recognition.start();
    } else {
      toast({
        title: "Not supported",
        description: "Speech recognition is not supported in your browser",
        variant: "destructive",
      });
    }
  };

  const handleWebSearch = () => {
    toast({
      title: "Web Search",
      description: "Web search functionality would be implemented here",
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-chat-container rounded-3xl shadow-elegant border border-border/50 overflow-hidden">
        {/* Chat Input */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything or @mention a Space"
            className="w-full min-h-[120px] max-h-[200px] p-6 bg-chat-input border-none outline-none resize-none text-foreground placeholder:text-chat-placeholder text-base leading-relaxed"
            disabled={isLoading}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between px-5 pb-5">
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 h-8 px-3 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-xl text-sm transition-colors">
                  {React.createElement(searchModes[searchMode].icon, { className: "w-4 h-4" })}
                  {searchModes[searchMode].label}
                  <ChevronDown className="w-3 h-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                {Object.entries(searchModes).map(([key, mode]) => (
                  <DropdownMenuItem 
                    key={key}
                    onClick={() => setSearchMode(key)}
                    className="flex items-start gap-3 p-3 cursor-pointer"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      {React.createElement(mode.icon, { className: "w-4 h-4 mt-0.5 flex-shrink-0" })}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{mode.label}</span>
                          <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-md font-medium">
                            {mode.badge}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {mode.description}
                        </p>
                      </div>
                    </div>
                    {searchMode === key && (
                      <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                      </div>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-2">
            <ChatButton
              onClick={handleFileAttach}
              tooltip="Attach File"
            >
              <Paperclip className="w-5 h-5" />
            </ChatButton>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 h-8 px-3 py-1.5 bg-secondary text-secondary-foreground hover:bg-secondary/80 font-medium rounded-xl text-sm transition-colors border border-border/50">
                  {React.createElement(models[selectedModel].icon, { className: "w-4 h-4" })}
                  {models[selectedModel].label}
                  {models[selectedModel].badge && (
                    <span className="text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-md font-medium">
                      {models[selectedModel].badge}
                    </span>
                  )}
                  <ChevronDown className="w-3 h-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-64">
                {Object.entries(models).map(([key, model]) => (
                  <DropdownMenuItem 
                    key={key}
                    onClick={() => setSelectedModel(key)}
                    className="flex items-start gap-3 p-3 cursor-pointer"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      {React.createElement(model.icon, { className: "w-4 h-4 mt-0.5 flex-shrink-0" })}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{model.label}</span>
                          {model.badge && (
                            <span className="text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-md font-medium">
                              {model.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {model.description}
                        </p>
                      </div>
                    </div>
                    {selectedModel === key && (
                      <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                      </div>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <ChatButton
              onClick={handleVoiceInput}
              tooltip="Voice Input"
              className={isListening ? "bg-destructive text-destructive-foreground" : ""}
            >
              {isListening ? (
                <MicIcon className="w-5 h-5 animate-pulse" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </ChatButton>

            <ChatButton
              variant="send"
              onClick={handleSend}
              disabled={!message.trim() || isLoading}
              tooltip="Send (Ctrl+Enter)"
              className="disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </ChatButton>
          </div>
        </div>
      </div>
    </div>
  );
};