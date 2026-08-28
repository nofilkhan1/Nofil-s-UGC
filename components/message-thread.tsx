"use client";

import { useEffect, useRef } from "react";

type Message = { id: string; sender_id: string; sender_name: string; body: string; created_at: string };

export function MessageThread({ messages, viewerId }: { messages: Message[]; viewerId: string }) {
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, []);
  return <section className="panel message-thread" aria-label="Messages">{messages.length ? messages.map((message, index) => { const mine = message.sender_id === viewerId; const previous = messages[index - 1]; const showSender = !previous || previous.sender_id !== message.sender_id; return <article className={`message-bubble ${mine ? "message-bubble--mine" : "message-bubble--other"}`} key={message.id}>{showSender ? <strong className="message-bubble__sender">{mine ? "You" : message.sender_name}</strong> : null}<p>{message.body}</p><time dateTime={message.created_at}>{new Date(message.created_at).toLocaleString()}</time></article>; }) : <p className="muted">No messages yet. Start the conversation below.</p>}<div ref={endRef} aria-hidden="true" /></section>;
}
