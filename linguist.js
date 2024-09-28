const OpenAI = require("openai");
require("dotenv").config(); // load env variables

const openai = new OpenAI();

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: "What is a LLM?" },
    ],
    model: "gpt-3.5-turbo",
  });

  console.log(completion.choices[0]);
}
main();
