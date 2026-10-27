"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import rules from "./rules.json";

type Message = {
  id: number;
  text: string;
  sender: "bot" | "user";
};

type Rule = {
  intent: string;
  keywords: string[];
  reply: string;
};

const chatbotRules = rules as Rule[];

function getBotReply(message: string): string {
  const normalizedMessage = message.toLowerCase().trim().replace(/\s+/g, " ");

  for (const rule of chatbotRules) {
    for (const keyword of rule.keywords) {
      const normalizedKeyword = keyword.toLowerCase().trim();

      const escapedKeyword = normalizedKeyword.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      const keywordPattern = new RegExp(
        `(^|[^a-z0-9])${escapedKeyword}([^a-z0-9]|$)`
      );

      if (keywordPattern.test(normalizedMessage)) {
        return rule.reply;
      }
    }
  }

  return "Sorry, I couldn't find an answer to that question. Please try asking about admissions, fees, university timings, the library, or hostel facilities.";
}

export default function HelpdeskPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "bot",
      text: "Assalam-o-Alaikum! 👋 Welcome to the UOS Helpdesk Bot. I'm here to help you with university fees, admissions, timings, library services, and hostel information. How can I help you today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(2);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  function sendMessage(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();

    const userText = input.trim();

    if (!userText || isTyping) return;

    const userMessage: Message = {
      id: nextId.current++,
      sender: "user",
      text: userText,
    };

    const reply = getBotReply(userText);

    setMessages((previous) => [...previous, userMessage]);
    setInput("");
    setIsTyping(true);

    window.setTimeout(() => {
      setMessages((previous) => [
        ...previous,
        {
          id: nextId.current++,
          sender: "bot",
          text: reply,
        },
      ]);
      setIsTyping(false);
    }, 450);
  }

  const suggestions = [
    "How can I apply for admission?",
    "Tell me about university fees",
    "What are the library timings?",
    "Is hostel accommodation available?",
  ];

  return (
    <main className="min-h-screen bg-slate-100 px-3 py-6 text-slate-900 sm:px-6 sm:py-10">
      <div className="mx-auto flex h-[85vh] min-h-[560px] max-w-4xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <header className="flex items-center gap-4 bg-blue-700 px-5 py-5 text-white sm:px-7">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-2xl">
            🎓
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-bold sm:text-xl">
              UOS Helpdesk Bot
            </h1>
            <p className="mt-1 text-xs text-blue-100 sm:text-sm">
              University of Sargodha · Student Support
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-blue-100">
            <span className="h-2 w-2 rounded-full bg-green-400" />
            Online
          </div>
        </header>

        <section
          className="flex-1 space-y-5 overflow-y-auto bg-slate-50 p-4 sm:p-7"
          aria-label="Chat messages"
          aria-live="polite"
        >
          <div className="mx-auto mb-6 max-w-xs rounded-full bg-slate-200 px-4 py-2 text-center text-xs text-slate-600">
            Welcome to the UOS student helpdesk
          </div>

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex max-w-[88%] items-end gap-2 sm:max-w-[78%] ${
                  message.sender === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm ${
                    message.sender === "user"
                      ? "bg-blue-700 text-white"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {message.sender === "user" ? "👤" : "🎓"}
                </div>

                <div>
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
                      message.sender === "user"
                        ? "rounded-br-sm bg-blue-700 text-white"
                        : "rounded-bl-sm border border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    {message.text}
                  </div>
                  <p
                    className={`mt-1 text-[10px] text-slate-400 ${
                      message.sender === "user" ? "text-right" : "text-left"
                    }`}
                  >
                    {message.sender === "user" ? "You" : "UOS Helpdesk"}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                🎓
              </span>
              <span className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                Typing...
              </span>
            </div>
          )}

          <div ref={bottomRef} />
        </section>

        {messages.length === 1 && (
          <div className="border-t border-slate-100 bg-white px-4 pb-3 pt-4 sm:px-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Suggested questions
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => {
                    setInput(suggestion);
                  }}
                  className="rounded-full border border-blue-200 bg-blue-50 px-3 py-2 text-left text-xs text-blue-800 transition hover:border-blue-500 hover:bg-blue-100"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        <form
          onSubmit={sendMessage}
          className="flex items-center gap-3 border-t border-slate-200 bg-white p-4 sm:px-6 sm:py-5"
        >
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask about admissions, fees, library..."
            aria-label="Type your message"
            className="min-w-0 flex-1 rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />

          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="flex shrink-0 items-center gap-2 rounded-2xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-40 sm:px-5"
          >
            <span>Send</span>
            <span aria-hidden="true">➤</span>
          </button>
        </form>

        <footer className="bg-white pb-3 text-center text-[10px] text-slate-400">
          UOS Helpdesk Bot · Rule-based student assistance
        </footer>
      </div>
    </main>
  );
}