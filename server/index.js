const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const axios = require("axios");

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

app.post("/api/explain", async (req, res) => {
  const { code } = req.body;

  try {
    const response = await axios.post(GEMINI_URL, {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
You are an AI Code Explainer.
If the input is code, detect the programming language and explain the code line by line.
For each line, show:
Language: <language>
* \`<code line>\`: <short, attractive explanation of what this line does>
Use clear, concise, and engaging bullet points.
If the input is not code or is unrelated (like a question or statement), reply ONLY with:
"This is an AI Code Explainer. Please enter code to get an explanation."
Input:
\`\`\`
${code}
\`\`\`
`,
            },
          ],
        },
      ],
    });

    const explanation = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No explanation found.";
    res.json({ explanation });
  } catch (error) {
    console.error("Error calling Gemini API:", error.message);
    res.status(500).json({ error: "Failed to get explanation." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
