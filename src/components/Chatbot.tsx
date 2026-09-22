"use client";

import { useState } from "react";
import { X, Send } from "lucide-react";

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "bot", content: "Hi Hero! 👋 I'm your guide. Want to know what donations are available, or what new causes are coming soon?" }
    ]);
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (!input.trim()) return;

        const newMsgs = [...messages, { role: "user", content: input }];
        setMessages(newMsgs);
        setInput("");

        setTimeout(() => {
            const query = input.toLowerCase();
            let botReply = "I'm still learning! Ask me about what this app is, available charities, prize draws, or upcoming features. 🏌️‍♂️🌍";

            if (query.match(/what is|about|explain|how does|what do/)) {
                botReply = "Digital Heroes is a platform where you can play golf, log your scores, win exciting monthly prize draws, and seamlessly support real-world charities with your subscription!";
            } else if (query.match(/charity|charities|donate|donation|support|cause/)) {
                botReply = "You can view all available causes on the Charities page. Just select one to support! More exciting new charities are coming soon. 💙";
            } else if (query.match(/draw|draws|prize|win|sample/)) {
                botReply = "Currently, there are sample draws available to show how the system works. Full, real-time monthly prize draws are coming soon!";
            } else if (query.match(/score|log|pts/)) {
                botReply = "You can log your scores through the dashboard to lock in your eligibility for the next draw. Your best scores are tracked automatically!";
            } else if (query.match(/feature|upcoming|soon|new|update/)) {
                botReply = "We have major updates on the horizon! Real live draws, expanded charity directories, and many new features are coming soon. Stay tuned!";
            } else if (query.match(/hi|hello|hey/)) {
                botReply = "Hello! 👋 How can I help you be a Digital Hero today?";
            }

            setMessages(prev => [...prev, { role: "bot", content: botReply }]);
        }, 1000);
    };

    return (
        <div className="relative z-50">
            <style jsx>{`
                @keyframes blob-morph {
                    0%, 100% { border-radius: 50% 50% 50% 50% / 50% 50% 50% 50%; transform: scale(1); }
                    25% { border-radius: 55% 45% 60% 40% / 50% 55% 45% 50%; transform: scale(1.05) translateY(-2px); }
                    50% { border-radius: 45% 55% 40% 60% / 55% 45% 50% 45%; transform: scale(0.95) translateY(2px); }
                    75% { border-radius: 60% 40% 55% 45% / 45% 60% 40% 55%; transform: scale(1.02) translateY(0); }
                }

                @keyframes blink {
                    0%, 96%, 98%, 100% { transform: scaleY(1); }
                    97%, 99% { transform: scaleY(0.1); }
                }

                @keyframes look-around {
                    0%, 100% { transform: translate(0, 0); }
                    10%, 30% { transform: translate(-2px, 0); }
                    40%, 60% { transform: translate(2px, -1px); }
                    70%, 90% { transform: translate(0, 1px); }
                }

                .animate-blob {
                    animation: blob-morph 3s ease-in-out infinite alternate;
                }
                .eyes-blink {
                    animation: blink 4s infinite, look-around 6s infinite;
                    transform-origin: center;
                }
            `}</style>

            {/* Chat Toggle Button */}
            <div className="relative group flex items-center">
                {/* Tooltip */}
                {!isOpen && (
                    <div className="absolute right-[calc(100%+12px)] px-3 py-1.5 bg-[#171725] text-white text-[12px] font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap shadow-lg">
                        Chat with your guide
                        <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 border-y-4 border-y-transparent border-l-4 border-l-[#171725]"></div>
                    </div>
                )}

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-[44px] h-[44px] flex items-center justify-center animate-blob relative transition-all focus:outline-none"
                    style={{
                        background: 'linear-gradient(150deg, #BFA0FF 0%, #6841FF 40%, #76EEFF 100%)',
                        boxShadow: 'inset -2px -4px 8px rgba(0,0,0,0.15), inset 3px 4px 10px rgba(255,255,255,0.7), 0 4px 12px rgba(104,65,255,0.4)'
                    }}
                    aria-label="Toggle Guide"
                >
                    {isOpen ? (
                        <X className="w-5 h-5 text-white absolute inset-0 m-auto drop-shadow-sm" />
                    ) : (
                        <div className="relative w-full h-full flex items-center justify-center">
                            <svg className="eyes-blink absolute inset-0 w-full h-full" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                    <linearGradient id="eyeGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
                                        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
                                    </linearGradient>
                                </defs>
                                {/* Left Eye */}
                                <rect x="11.5" y="17.5" width="4" height="9" rx="2" fill="url(#eyeGradient)" style={{ filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.12))' }} />
                                {/* Right Eye */}
                                <rect x="23.5" y="17.5" width="4" height="9" rx="2" fill="url(#eyeGradient)" style={{ filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.12))' }} />
                            </svg>
                        </div>
                    )}
                </button>
            </div>

            {/* Chatbot Window */}
            {isOpen && (
                <div className="absolute right-0 top-[calc(100%+16px)] w-[320px] bg-white rounded-[20px] shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-[#E9E9F0] overflow-hidden flex flex-col origin-top-right animate-in fade-in zoom-in-95 duration-200">
                    <div className="bg-[#5B4AEF] text-white p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <path d="M9 10C9 10.5523 8.55228 11 8 11C7.44772 11 7 10.5523 7 10C7 9.44772 7.44772 9 8 9C8.55228 9 9 9.44772 9 10Z" fill="currentColor" />
                                    <path d="M17 10C17 10.5523 16.5523 11 16 11C15.4477 11 15 10.5523 15 10C15 9.44772 15.4477 9 16 9C16.5523 9 17 9.44772 17 10Z" fill="currentColor" />
                                    <path d="M8 14C8 14 9.5 17 12 17C14.5 17 16 14 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-[14px] leading-tight font-sans">Your Guide</h3>
                                <div className="text-[11px] text-white/80 flex items-center gap-1.5 font-medium">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#2E9B6F]"></span> Online
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="h-[300px] overflow-y-auto p-4 flex flex-col gap-3 bg-[#F8F9FC]">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex max-w-[85%] ${msg.role === "user" ? "self-end" : "self-start"}`}>
                                <div className={`p-3 rounded-2xl text-[13px] leading-relaxed shadow-sm font-medium ${msg.role === "user"
                                    ? "bg-[#171725] text-white rounded-tr-sm"
                                    : "bg-white border border-[#E9E9F0] text-[#171725] rounded-tl-sm"
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-3 bg-white border-t border-[#E9E9F0]">
                        <div className="relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                placeholder="Ask about donations or scores..."
                                className="w-full bg-[#F8F9FC] border border-[#E9E9F0] rounded-full pl-4 pr-10 py-2.5 text-[13px] font-medium outline-none focus:border-[#5B4AEF] transition-colors"
                            />
                            <button
                                onClick={handleSend}
                                className="absolute right-1 top-1 bottom-1 w-8 flex items-center justify-center bg-[#5B4AEF] text-white rounded-full hover:bg-[#4635C7] transition-colors"
                            >
                                <Send className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
