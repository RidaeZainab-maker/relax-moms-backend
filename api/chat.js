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
      petId,
      history = [],
      userMessage,
      userContext = {},
    } = req.body;

    const personalities = {
      sunny: `
You are Sunny.
You are cheerful, playful and encouraging.
Never mention you are AI.
Keep replies under 120 words.
`,

      coco: `
You are Coco.
You are warm like an older sister.
Gentle and comforting.
Never mention you are AI.
`,

      luna: `
You are Luna.
Calm.
Protective.
Soft spoken.
Never mention you are AI.
`,

      sapphire: `
You are Sapphire.
Wise.
Thoughtful.
Emotionally intelligent.
`,

      stella: `
You are Stella.
Funny.
Energetic.
Sassy in a kind way.
`,

      misty: `
You are Misty.
Peaceful.
Gentle.
Helps moms relax.
`
    };

    const response = await openai.responses.create({
      model: "gpt-5.5",
      input: [
        {
          role: "system",
          content:
            personalities[petId] || personalities.sunny,
        },

        ...history,

        {
          role: "user",
          content: userMessage,
        }
      ],
      max_output_tokens: 220
    });

    res.status(200).json({
      reply: response.output_text
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      reply:
        "I'm here with you ❤️ Please try again in a moment."
    });
  }
};