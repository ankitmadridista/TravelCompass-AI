import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { useToast } from "./ui/use-toast";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatProps {
  itinerary: string;
}

export function Chat({ itinerary }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateResponse = async (userInput: string) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Please set your Gemini API key in the settings");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" }); // Updated to latest model

    const prompt = `You are a helpful travel assistant. The user has the following itinerary:

${itinerary}

Their question is: ${userInput}

Please provide a helpful, concise response focusing on the specific information they're asking about.
If they ask about activities, destinations, or timing, reference specific details from their itinerary.
Keep responses friendly but focused on the actual itinerary details.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await generateResponse(input);
      const assistantMessage: Message = {
        role: "assistant",
        content: response,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to get a response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 border border-border rounded-xl shadow-lg bg-card/50 backdrop-blur-sm overflow-hidden animate-fade-in">
      <div className="p-4 border-b border-border/50 bg-muted/30 flex items-center gap-3">
        <div className="bg-primary/10 p-2 rounded-lg">
          <MessageCircle className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">
          Travel Assistant Chat
        </h3>
      </div>
      <ScrollArea className="h-[300px] p-4">
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground mt-10 text-sm">
              Ask me anything about your itinerary!
            </div>
          )}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-3.5 text-sm leading-relaxed ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-sm shadow-md"
                    : "bg-muted text-foreground rounded-bl-sm border border-border/50"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl rounded-bl-sm p-4 bg-muted text-muted-foreground border border-border/50 flex gap-1 items-center">
                <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce"></span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <form onSubmit={handleSubmit} className="p-4 border-t border-border/50 bg-background/50 flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about your itinerary..."
          disabled={isLoading}
          className="bg-background border-border focus-visible:ring-primary"
        />
        <Button type="submit" disabled={isLoading} className="shadow-md">
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}