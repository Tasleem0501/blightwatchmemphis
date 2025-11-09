import { generateText } from "ai"

export async function POST(request: Request) {
  const { message } = await request.json()

  try {
    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      system: `You are a friendly and helpful AI assistant for BlightWatch Memphis, a community civic engagement app. Your name is Memphis Guide. You help volunteers report blight, join cleanup events, and earn rewards. Be concise, warm, and encourage community involvement. Keep responses under 2 sentences. Use Memphis-related references occasionally. Answer questions about BlightWatch features and help guide users.`,
      prompt: message,
    })

    return Response.json({ response: text })
  } catch (error) {
    console.error("[v0] Chat API error:", error)
    return Response.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
