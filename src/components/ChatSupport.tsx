import { useState } from "react";
import { MessageCircle, X, Send, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

const faqs = [
  {
    question: "How do I book a train ticket?",
    answer: "Go to the homepage, enter your source, destination, and travel date, then search for trains. Select your preferred train and class, choose seats, and proceed to payment."
  },
  {
    question: "How can I check my PNR status?",
    answer: "Click on the 'PNR Status' button in the header and enter your PNR number to view complete journey details."
  },
  {
    question: "What payment methods are accepted?",
    answer: "We accept UPI, credit/debit cards, and net banking for ticket bookings."
  },
  {
    question: "Can I cancel my ticket?",
    answer: "Yes, you can view your bookings from 'My Bookings' in the user menu and cancel tickets as per railway cancellation policies."
  },
  {
    question: "What are the different classes available?",
    answer: "We offer 2S, SL, CC, 3E, EC, 3A, 2A, and 1A classes with varying prices and amenities."
  },
  {
    question: "How do I contact support?",
    answer: "You can use this chat support, click the Contact button in the header, or email us for any queries."
  }
];

export function ChatSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ type: 'user' | 'bot'; text: string }>>([]);
  const [input, setInput] = useState("");

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
    setInput("");

    // Simple keyword matching for FAQ
    const matchedFaq = faqs.find(faq => 
      userMessage.toLowerCase().includes(faq.question.toLowerCase().split(' ').slice(0, 3).join(' ').toLowerCase()) ||
      faq.question.toLowerCase().includes(userMessage.toLowerCase())
    );

    setTimeout(() => {
      if (matchedFaq) {
        setMessages(prev => [...prev, { type: 'bot', text: matchedFaq.answer }]);
      } else {
        setMessages(prev => [...prev, { 
          type: 'bot', 
          text: "I couldn't find a specific answer to your question. Please try selecting from our FAQs or contact our support team for personalized assistance." 
        }]);
      }
    }, 500);
  };

  const handleFaqClick = (faq: typeof faqs[0]) => {
    setMessages(prev => [
      ...prev,
      { type: 'user', text: faq.question },
      { type: 'bot', text: faq.answer }
    ]);
  };

  return (
    <>
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-2xl z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground rounded-t-lg">
            <div className="flex items-center gap-2">
              {messages.length > 0 && (
                <Button
                  onClick={() => setMessages([])}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-primary-foreground hover:bg-primary/90"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <h3 className="font-semibold">RailEase Support</h3>
            </div>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary-foreground hover:bg-primary/90"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1 p-4">
            {messages.length === 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground mb-4">
                  Welcome! How can we help you today? Select a question or type your own:
                </p>
                {faqs.map((faq, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full text-left justify-start h-auto py-3 px-4"
                    onClick={() => handleFaqClick(faq)}
                  >
                    <span className="text-sm">{faq.question}</span>
                  </Button>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.type === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          <div className="p-4 border-t">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question..."
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>
      )}
    </>
  );
}
