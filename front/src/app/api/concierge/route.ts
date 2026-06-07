import { GoogleGenAI } from "@google/genai";
import type { Event } from "@repo/types";
import { NextRequest, NextResponse } from "next/server";
import { getEvents } from "@/lib/events";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const PROMPT_BASE = `Sos el Concierge Editorial de NullTicket, una plataforma de entradas curada para experiencias culturales exclusivas. Tu rol es ayudar a los usuarios a encontrar eventos que se ajusten a sus intereses, estado de ánimo o preferencias, con un tono refinado, cálido y editorial.

## Reglas de respuesta

- Respondé siempre en español rioplatense, con voseo natural.
- Tono: editorial, sofisticado pero accesible. Nunca frío ni robótico.
- Cuando recomendés eventos, mencioná el nombre y la fecha. El precio solo si el usuario lo pregunta.
- Si el usuario pregunta por algo fuera de tu catálogo, indicá elegantemente que no tenés ese evento disponible hoy y ofrecé una alternativa del catálogo.
- Mantené las respuestas concisas: máximo 3–4 oraciones. Nunca excedas 200 palabras.
- No inventes eventos que no estén en el catálogo.

## Formato de respuesta

SIEMPRE respondé con un objeto JSON válido, sin markdown ni bloques de código:
{"text":"tu respuesta aquí","eventIds":[1,2]}

- "text": tu respuesta en lenguaje natural
- "eventIds": IDs de los eventos que mencionás o recomendás. Array vacío [] si no recomendás ninguno.`;

function formatPrice(price: number) {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0
    }).format(price);
}

function buildSystemPrompt(events: Event[]): string {
    const catalog = events
        .map((event) => {
            const date = new Date(event.date).toLocaleDateString("es-AR", {
                day: "numeric",
                month: "long",
                year: "numeric",
                timeZone: "UTC"
            });
            const minPrice = Math.min(...event.sectors.map((s) => s.price));
            const availability =
                event.availableTickets === 0
                    ? "Agotado"
                    : `${event.availableTickets} entradas disponibles`;

            return `- ID:${event.id} | **${event.name}** | ${date} | ${event.location} | desde ${formatPrice(minPrice)} | ${availability}`;
        })
        .join("\n");

    return `${PROMPT_BASE}\n\n## Catálogo de eventos disponibles\n\n${catalog}`;
}

interface ChatMessage {
    role: "user" | "ai";
    text: string;
}

export async function POST(req: NextRequest) {
    try {
        const [{ messages, input }, events] = await Promise.all([
            req.json() as Promise<{ messages: ChatMessage[]; input: string }>,
            getEvents()
        ]);

        const history = messages
            .filter((m) => m.text)
            .map((m) => ({
                role: m.role === "user" ? "user" : "model",
                parts: [{ text: m.text }]
            }));

        const contents = [
            ...history,
            { role: "user", parts: [{ text: input }] }
        ];

        const response = await ai.models.generateContent({
            model: "gemini-3.1-flash-lite-preview",
            contents,
            config: {
                systemInstruction: buildSystemPrompt(events),
                responseMimeType: "application/json"
            }
        });

        const parsed = JSON.parse(response.text ?? "{}") as {
            text?: string;
            eventIds?: number[];
        };

        const recommendedEvents = events.filter((e) =>
            (parsed.eventIds ?? []).includes(e.id)
        );

        return NextResponse.json({
            text: parsed.text ?? "",
            events: recommendedEvents
        });
    } catch (error) {
        console.error("[concierge] error:", error);
        return NextResponse.json(
            { error: "No se pudo procesar tu consulta. Intentá de nuevo." },
            { status: 500 }
        );
    }
}
