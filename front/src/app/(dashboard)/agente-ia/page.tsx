'use client';

import { useState, useRef, useEffect } from 'react';
import { useTickets } from '@/context/TicketContext';

interface ChatMessage {
  actor: 'ai' | 'user';
  txt: string;
}

const parseOrder = (text: string): number | null => {
  const match = text.match(/\d+/);
  if (!match) return null;
  return parseInt(match[0], 10);
};

export default function AIAssistant() {
  const { comprarTickets } = useTickets();
  const [chat, setChat] = useState<ChatMessage[]>([
    {
      actor: 'ai',
      txt: '¡Hola! Soy la IA de compras del sistema. Puedo gestionar tu adquisición de forma automática ahorrándote los clicks. Práctica pidiéndome: "Quiero 4 tickets por favor".',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;

    const userText = input.trim();
    setChat((prev) => [...prev, { actor: 'user', txt: userText }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const cantidad = parseOrder(userText.toLowerCase());

      if (cantidad) {
        const result = comprarTickets(cantidad);
        if (result.success) {
          setChat((prev) => [
            ...prev,
            { actor: 'ai', txt: `¡Entendido! He procesado automáticamente el descuento. ${result.message}` },
          ]);
        } else {
          setChat((prev) => [
            ...prev,
            { actor: 'ai', txt: `Lo siento, hubo un problema operativo: ${result.message}` },
          ]);
        }
      } else {
        setChat((prev) => [
          ...prev,
          {
            actor: 'ai',
            txt: 'Perdona, me cuesta entender cuántas unidades especificas. Trata de escribir el número exacto, como: "Necesito comprar 2 tickets".',
          },
        ]);
      }
    }, 1200);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat, isTyping]);

  return (
    <div className="glass-panel flex flex-col h-[75vh] max-w-4xl mx-auto overflow-hidden border border-purple-500/30">
      <div className="bg-purple-900/40 p-6 border-b border-purple-500/30 flex gap-4 items-center">
        <span className="text-4xl filter drop-shadow-md">✨</span>
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
            Asistente IA Interactivo
          </h2>
          <p className="text-sm text-purple-300/70 mt-1">Simulación de Auto-Surtido de Stock (Local JS)</p>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6">
        {chat.map((msg, i) => (
          <div key={i} className={`flex ${msg.actor === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[70%] text-lg p-5 rounded-3xl shadow-lg leading-relaxed ${
                msg.actor === 'user'
                  ? 'bg-blue-600 rounded-br-none text-white'
                  : 'bg-gray-800/90 rounded-tl-none border border-gray-700 text-gray-200'
              }`}
            >
              <p>{msg.txt}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-800/90 rounded-3xl rounded-tl-none p-5 border border-gray-700 flex gap-2 w-24 justify-center items-center h-16">
              <span className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></span>
              <span className="w-3 h-3 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-3 h-3 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-1" />
      </div>

      <form onSubmit={handleSend} className="p-5 bg-gray-900 border-t border-gray-800 flex gap-3 items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Comunícate con la IA ej: "Adquirir 3 tickets"'
          className="flex-1 text-lg bg-gray-800 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-purple-500 transition border border-gray-700"
          autoFocus
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-4 text-lg font-bold rounded-2xl transition shadow-lg shadow-purple-500/20 text-white"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
