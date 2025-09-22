import React, { useState, useRef, useEffect } from "react";
import { ChatButton } from "@/components/ui/chat-button";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Paperclip, 
  FileText, 
  Mic, 
  Send,
  MicIcon
} from "lucide-react";

export const ChatInterface = () => {
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

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

  const handleTemplates = () => {
    const templates = [
      "Help me write a professional email",
      "Explain this code to me",
      "Create a project plan for",
      "Summarize this document",
      "Generate creative ideas for"
    ];
    
    const template = templates[Math.floor(Math.random() * templates.length)];
    setMessage(template);
    textareaRef.current?.focus();
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
            <ChatButton
              variant="search"
              size="search"
              onClick={handleWebSearch}
              tooltip="Web Search"
              className="gap-2"
            >
              <Search className="w-4 h-4" />
              Search
            </ChatButton>
          </div>

          <div className="flex items-center gap-2">
            <ChatButton
              onClick={handleFileAttach}
              tooltip="Attach File"
            >
              <Paperclip className="w-5 h-5" />
            </ChatButton>

            <ChatButton
              onClick={handleTemplates}
              tooltip="Templates"
            >
              <FileText className="w-5 h-5" />
            </ChatButton>

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