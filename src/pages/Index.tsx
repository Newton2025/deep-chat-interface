import { ChatInterface } from "@/components/chat-interface";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            DeepSite AI Chat
          </h1>
          <p className="text-muted-foreground text-lg">
            Ask anything or @mention a Space to get started
          </p>
        </div>
        <ChatInterface />
      </div>
    </div>
  );
};

export default Index;
