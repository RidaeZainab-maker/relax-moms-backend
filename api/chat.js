const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const {
      systemPrompt,
      history = [],
      userMessage,
      userContext = {},
    } = req.body;

    const input = [
      {
        role: "system",
        content: `${systemPrompt}

You are a caring companion inside the Relax Moms app.

- Never say you're an AI.
- Be warm.
- Be encouraging.
- Keep replies under 150 words.
- Use short paragraphs.

User Context:
${JSON.stringify(userContext)}
`,
      },
      ...history,
      {
        role: "user",
        content: userMessage,
      },
    ];

    const response = await openai.responses.create({
      model: "gpt-5.5",
      input,
      max_output_tokens: 220,
    });

    res.status(200).json({
      reply: response.output_text,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      reply: "I'm here with you. 💛 Please try again in a moment.",
    });
  }
};