import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Cpu, Calendar } from 'lucide-react';

export default function AIChatbot({ properties }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Hello! I am your Aetheria AI Assistant. How can I help you find your next home? You can ask about ROI trends, staging, or schedule a tour.",
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (e) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      let replyText = "";
      let attachedProperty = null;
      let showScheduler = false;

      const txt = currentInput.toLowerCase();
      if (txt.includes('helix') || txt.includes('penthouse') || txt.includes('roi') || txt.includes('obsidian')) {
        replyText = "The Helix Penthouse value has increased by 4.8% over the past 5 months, with solid future ROI growth projection.";
        attachedProperty = properties.find(p => p.id === 'prop-1' || p.title.toLowerCase().includes('helix'));
      } else if (txt.includes('eco') || txt.includes('villa') || txt.includes('green') || txt.includes('terra')) {
        replyText = "The Terra Estate has premium biophilic and solar integrations and lists for ₹62 Lakhs. It has a matching score of 94%.";
        attachedProperty = properties.find(p => p.id === 'prop-2' || p.title.toLowerCase().includes('terra'));
      } else if (txt.includes('schedule') || txt.includes('tour') || txt.includes('book') || txt.includes('viewing')) {
        replyText = "Sure, I can coordinate a virtual tour or physical viewing for you. Select a slot:";
        showScheduler = true;
      } else {
        replyText = "Feel free to inquire about active listings (such as Helix Penthouse or Terra Estate) or let me know if you would like to arrange a tour.";
      }

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'ai',
        text: replyText,
        property: attachedProperty,
        showScheduler: showScheduler,
        timestamp: new Date()
      }]);
    }, 1200);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-accent-blue hover:opacity-90 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer outline-none"
        >
          <MessageSquare size={24} />
        </button>
      )}

      {/* Chat Box */}
      {isOpen && (
        <div className="w-[350px] h-[480px] bg-white border border-border-subtle rounded-card shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex flex-col overflow-hidden text-left">
          {/* Header */}
          <div className="px-4 py-3.5 bg-surface-offwhite border-b border-border-subtle flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-[6px] bg-accent-blue/15 flex items-center justify-center">
                <Cpu size={14} className="text-accent-blue" />
              </div>
              <div>
                <h4 className="text-[13px] font-bold text-primary">Aetheria Assistant</h4>
                <span className="text-[10px] font-semibold text-success">Online</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-on-surface-variant hover:text-primary cursor-pointer transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3.5">
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`max-w-[85%] ${msg.sender === 'user' ? 'self-end' : 'self-start'}`}
              >
                <div className={`px-4 py-2.5 rounded-[14px] text-[13px] leading-relaxed ${msg.sender === 'user' ? 'bg-accent-blue text-white' : 'bg-surface-offwhite border border-border-subtle text-primary'}`}>
                  {msg.text}
                </div>

                {/* Property Card */}
                {msg.property && (
                  <div className="mt-2 bg-white border border-border-subtle rounded-lg overflow-hidden shadow-sm">
                    <img src={msg.property.image} alt={msg.property.title} className="w-full h-20 object-cover" />
                    <div className="p-2">
                      <h5 className="text-[12px] font-bold text-primary truncate">{msg.property.title}</h5>
                      <span className="text-[11px] font-bold text-accent-blue">
                        ₹{(msg.property.price / 100000).toFixed(0)} Lakhs
                      </span>
                    </div>
                  </div>
                )}

                {/* Tour scheduler */}
                {msg.showScheduler && (
                  <div className="mt-2 bg-surface-offwhite border border-border-subtle rounded-lg p-2 text-[12px]">
                    <div className="flex gap-1 items-center mb-2 font-bold text-primary">
                      <Calendar size={12} className="text-accent-blue" /> 
                      <span>Select slot:</span>
                    </div>
                    {['Tomorrow at 2:00 PM', 'Saturday at 11:00 AM'].map((slot, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setMessages(prev => [...prev, {
                            id: Date.now() + 2,
                            sender: 'ai',
                            text: `Scheduled successfully for: ${slot}. Confirmation sent.`,
                            timestamp: new Date()
                          }]);
                        }}
                        className="w-full text-left bg-white border border-border-strong hover:bg-surface-offwhite text-primary px-3 py-1.5 rounded-[4px] mb-1.5 transition-colors cursor-pointer"
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="self-start bg-surface-offwhite border border-border-subtle px-4 py-2.5 rounded-[14px] text-[13px] text-on-surface-variant font-medium animate-pulse">
                Typing...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Footer form */}
          <form onSubmit={handleSend} className="p-2.5 border-t border-border-subtle flex gap-2">
            <input
              type="text"
              id="chatbot-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 h-9 px-3 bg-surface-offwhite border border-border-strong rounded-full text-[13px] focus:outline-none focus:ring-1 focus:ring-accent-blue/30 focus:border-accent-blue"
            />
            <button 
              type="submit" 
              className="w-9 h-9 bg-accent-blue hover:opacity-90 text-white rounded-full flex items-center justify-center cursor-pointer transition-opacity"
            >
              <Send size={12} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
