import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdamApp() {
  const [messages, setMessages] = useState([
    { from: "adam", text: "Ahoj Rosťo! Jsem připraven ti pomáhat. Co potřebuješ?" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { from: "you", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const res = await fetch("https://adam-assistant-backend.onrender.com/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      const adamReply = { from: "adam", text: data.response };
      setMessages((prev) => [...prev, adamReply]);
    } catch (err) {
      setMessages((prev) => [...prev, { from: "adam", text: "Něco se pokazilo. Zkus to znovu." }]);
    }
  };

  // Scroll to bottom when messages update
  useEffect(() => {
    const container = document.getElementById("scroll-container");
    if (container) container.scrollTop = container.scrollHeight;
  }, [messages]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col">
      <h1 className="text-xl font-bold text-center mb-4">Adam – tvůj osobní asistent</h1>
      <div id="scroll-container" className="flex-1 overflow-y-auto space-y-2 mb-4 max-h-[75vh]">
        {messages.map((msg, idx) => (
          <Card key={idx} className={`max-w-md ${msg.from === "you" ? "ml-auto" : "mr-auto"}`}>
            <CardContent className="p-2">
              <p className={msg.from === "you" ? "text-right" : "text-left"}>{msg.text}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Zeptej se Adama…"
          className="flex-1"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <Button onClick={handleSend}>Odeslat</Button>
      </div>
    </div>
  );
}
