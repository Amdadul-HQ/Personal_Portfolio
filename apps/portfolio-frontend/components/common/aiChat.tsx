"use client";

import { useEffect, useRef, useState } from "react";
import { FaRobot, FaCommentDots, FaPaperPlane, FaTimes } from "react-icons/fa";

type Turn = { role: "user" | "assistant"; content: string };

const API = process.env.NEXT_PUBLIC_API_URL;

export default function AiChat() {
  const [open, setOpen] = useState(false);
  const [greeting, setGreeting] = useState(
    "Hi! I'm Amdadul's AI assistant. Ask me anything about him.",
  );
  const [messages, setMessages] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load the greeting from the backend once.
  useEffect(() => {
    let active = true;
    fetch(`${API}/ai/config`)
      .then((r) => r.json())
      .then((d) => {
        if (active && d?.data?.greeting) setGreeting(d.data.greeting);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  // Auto-scroll to the newest message.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const history = messages; // real turns only (greeting is display-only)
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setLoading(true);
    try {
      const res = await fetch(`${API}/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });
      const data = await res.json();
      const reply: string =
        data?.data?.reply || "Sorry, something went wrong. Please try again.";
      setMessages([...next, { role: "assistant", content: reply }]);
    } catch {
      setMessages([
        ...next,
        {
          role: "assistant",
          content:
            "I couldn't reach the server. Please check your connection or use the contact page.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating launcher */}
      <button
        aria-label={open ? "Close AI chat" : "Open AI chat"}
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full bg-green-500 text-white shadow-[0_10px_30px_-8px_rgba(34,197,94,0.7)] transition-transform hover:scale-105 active:scale-95"
      >
        {open ? <FaTimes size={20} /> : <FaCommentDots size={22} />}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[70vh] max-h-[560px] w-[92vw] max-w-[380px] flex-col overflow-hidden rounded-2xl border border-green-500/20 bg-white shadow-2xl dark:bg-[#0f1524]">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-green-500/15 bg-green-500/10 px-4 py-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-green-500 text-white">
              <FaRobot size={16} />
            </span>
            <div>
              <p className="text-sm font-semibold text-primary">Ask about Amdadul</p>
              <p className="text-xs text-green-600 dark:text-green-400">AI assistant · online</p>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            <Bubble role="assistant">{greeting}</Bubble>
            {messages.map((m, i) => (
              <Bubble key={i} role={m.role}>
                {m.content}
              </Bubble>
            ))}
            {loading && (
              <Bubble role="assistant">
                <span className="inline-flex gap-1">
                  <Dot /> <Dot /> <Dot />
                </span>
              </Bubble>
            )}
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 border-t border-green-500/15 p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask a question, or say 'contact'…"
              className="min-w-0 flex-1 rounded-full border border-green-500/30 bg-transparent px-4 py-2 text-sm text-primary outline-none focus:border-green-500"
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              aria-label="Send message"
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-green-500 text-white transition-opacity disabled:opacity-40"
            >
              <FaPaperPlane size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function Bubble({ role, children }: { role: "user" | "assistant"; children: React.ReactNode }) {
  const isUser = role === "user";
  return (
    <div className={isUser ? "flex justify-end" : "flex justify-start"}>
      <div
        className={
          "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm leading-relaxed " +
          (isUser
            ? "rounded-br-sm bg-green-500 text-white"
            : "rounded-bl-sm bg-green-500/10 text-primary")
        }
      >
        {children}
      </div>
    </div>
  );
}

function Dot() {
  return <span className="inline-block size-1.5 animate-bounce rounded-full bg-green-500" />;
}
