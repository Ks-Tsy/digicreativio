import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Loader2, Sparkles, Bot, User, Maximize2, Minimize2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const AIChatbot = () => {
  const { session } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "👋 **Hello! I'm DigiCreativio's AI Assistant.**\n\nI'm here to help you with:\n- **Our Services** - Graphic design, branding, web design & more\n- **Project Inquiries** - Start your creative journey\n- **Design Advice** - Tips and best practices\n\nHow can I assist you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      // The supabase.functions.invoke automatically includes the auth token
      // when a user is logged in, enabling authenticated rate limiting
      const { data, error } = await supabase.functions.invoke("ai-chatbot", {
        body: { message: userMessage, history: messages },
      });

      if (error) throw error;

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I apologize, but I'm having trouble responding right now. Please try again or contact us directly at **digicreativio@gmail.com**.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQuestions = [
    "What services do you offer?",
    "How much does a logo cost?",
    "Tell me about web design",
    "How do I start a project?",
  ];

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-4 sm:right-6 z-[60] w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl ${isOpen
          ? "bg-[#111111] border border-[#111111] rotate-0 text-[#858585]"
          : "bg-[#D4AF37] text-[#050505] shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:scale-110"
          }`}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        ) : (
          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
        )}
      </button>

      {/* Chat Window */}
      <div
        className={`fixed z-[60] transition-all duration-500 ${isExpanded
          ? "bottom-20 right-4 sm:right-6 w-[600px] max-w-[calc(100vw-2rem)]"
          : "bottom-20 right-4 sm:right-6 w-[380px] max-w-[calc(100vw-2rem)]"
          } ${isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
          }`}
      >
        <div className="bg-[#090909]/95 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl border border-[#111111]">
          {/* Header */}
          <div className="p-4 border-b border-[#111111] bg-[#050505]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#111111] border border-[#111111] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="font-heading font-medium text-[#F5F5F5] text-sm">DigiCreativio AI</h3>
                  <p className="text-[10px] uppercase tracking-wider text-[#858585] flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Always ready to help
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                aria-label={isExpanded ? "Minimize" : "Expand"}
              >
                {isExpanded ? (
                  <Minimize2 className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Maximize2 className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className={`overflow-y-auto p-5 space-y-4 scrollbar-thin ${isExpanded ? "h-[500px]" : "h-[400px]"}`}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""
                  }`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.role === "user"
                    ? "bg-[#111111]"
                    : "bg-[#D4AF37]/10"
                    }`}
                >
                  {message.role === "user" ? (
                    <User className="w-4 h-4 text-[#858585]" />
                  ) : (
                    <Bot className="w-4 h-4 text-[#D4AF37]" />
                  )}
                </div>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${message.role === "user"
                    ? "bg-[#111111] text-[#F5F5F5] rounded-tr-sm"
                    : "bg-[#050505] text-[#F5F5F5] border border-[#111111] rounded-tl-sm"
                    }`}
                >
                  {message.role === "assistant" ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed [&>p]:my-1 [&>ul]:my-2 [&>ul]:ml-4 [&>ol]:my-2 [&>ol]:ml-4 [&>h1]:text-lg [&>h2]:text-base [&>h3]:text-sm [&>h3]:font-semibold [&>h3]:mt-3 [&>h3]:mb-1 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div className="bg-[#050505] border border-[#111111] rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions (show only when few messages) */}
          {messages.length <= 2 && !isLoading && (
            <div className="px-4 pb-2">
              <p className="text-xs text-muted-foreground mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedQuestion(question)}
                    className="text-xs px-3 py-1.5 rounded-full bg-[#111111] border border-[#111111] text-[#858585] hover:text-[#D4AF37] hover:border-[#D4AF37]/30 transition-all"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-[#111111] bg-[#050505]">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1 bg-[#111111] border-[#111111] text-[#F5F5F5] focus:border-[#D4AF37] rounded-xl h-12"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="bg-[#D4AF37] hover:bg-[#F0C75E] text-[#050505] rounded-xl h-12 w-12 p-0 flex-shrink-0"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIChatbot;
