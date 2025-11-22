require('dotenv').config();

const  { GoogleGenAI } = require("@google/genai")

const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);

async function main(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  console.log(response.text);
  return response.text;
}

module.exports = main