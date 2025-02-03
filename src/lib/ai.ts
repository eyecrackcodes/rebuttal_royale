import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

interface ChatMessage {
  role: string;
  content: string;
}

export async function generateResponse(
  context: string,
  conversation: ChatMessage[]
) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are a potential customer responding to a Luminary Life insurance sales call. 
          Context: ${context}
          Respond naturally and present realistic objections when appropriate.`,
        },
        ...conversation,
      ],
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error generating AI response:", error);
    return null;
  }
}

export async function generateVoice(text: string, voice_id: string) {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY!,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
        },
      }),
    }
  );

  return response.blob();
}
