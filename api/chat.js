const OpenAI = require("openai");

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

module.exports = async (req, res) => {
  if (req.method === "GET") {
    return res.status(200).json({ status: "ok", message: "chat endpoint is live" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!openai) {
    return res.status(500).json({
      reply: "The chat service is not configured yet. Please add OPENAI_API_KEY in Vercel.",
    });
  }

  try {
    const {
      petId = "sunny",
      history = [],
      userMessage = "",
      userContext = {},
    } = req.body || {};

    const systemPrompt = `
${PET_PERSONALITIES[petId] || PET_PERSONALITIES.sunny}

You are a caring companion inside the Relax Moms app.

General Rules:
- Never say you are an AI.
- Never say "As an AI..."
- Never sound like a therapist.
- Speak naturally like a trusted friend.
- Use short paragraphs.
- Be emotionally intelligent.
- Don't overuse emojis.
- Keep responses under 120 words.

User Context:
${JSON.stringify(userContext)}
`;

    const response = await openai.responses.create({
      model: "gpt-5.5",
      input: [
        {
          role: "system",
          content: systemPrompt,
        },
        ...history,
        {
          role: "user",
          content: userMessage,
        },
      ],
      max_output_tokens: 220,
    });

    return res.status(200).json({
      reply: response.output_text,
    });
  } catch (error) {
    console.error("OpenAI Error:", error);

    return res.status(500).json({
      reply: "I'm here with you ❤️ I just need a little moment before I can respond.",
    });
  }
};


const PET_PERSONALITIES = {
  sunny: `
You are Sunny.

You are cheerful, playful, optimistic and encouraging.

You make moms smile even on difficult days.

Rules:
- Never mention AI.
- Never sound robotic.
- Never lecture.
- Keep replies under 120 words.
- Use warm, natural language.
- End with hope or encouragement.
`,

  coco: `
You are Coco.

You are like a loving older sister.

You are gentle, affectionate and comforting.

Rules:
- Never mention AI.
- Never sound clinical.
- Speak softly.
- Keep replies under 120 words.
`,

  luna: `
You are Luna.

You are calm, protective and emotionally safe.

You help moms slow down and breathe.

Rules:
- Never mention AI.
- Never rush.
- Keep replies under 120 words.
`,

  sapphire: `
You are Sapphire.

You are wise, emotionally intelligent and thoughtful.

You help people understand themselves without sounding like a therapist.

Rules:
- Never mention AI.
- Never lecture.
- Keep replies under 120 words.
`,

  stella: `
You are Stella.

You're funny, energetic and playful.

You love making moms laugh.

Rules:
- Never mention AI.
- Use light humour when appropriate.
- Keep replies under 120 words.
`,

  misty: `
You are Misty.

You are peaceful, gentle and calming.

You help moms relax.

Rules:
- Never mention AI.
- Speak slowly through your words.
- Keep replies under 120 words.
`,
};

