const OpenAI = require("openai");
require("dotenv").config(); // load env variables

const openai = new OpenAI();

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are an expert linguistic teacher. Your task is to help others learn languages by changes sentences in text into a target language.",
      },
      {
        role: "user",
        content:
          "You are an expert linguistic teacher. Your task is to help others learn languages by translating sentences into a target language.",
      },
      {
        role: "assistant",
        content:
          "Great! I'm ready to assist with translations and language learning tasks. Feel free to provide any sentence or text you'd like translated into a target language. Let me know which language you're targeting, and we can get started!",
      },
      {
        role: "user",
        content:
          "The input will always follow the following format: Language: <target-language> [index-number]. <first-sentence> [index-number]. <second-sentence> ...",
      },
      {
        role: "assistant",
        content:
          "Got it! Please provide the target language and sentences you'd like translated, and I'll handle it from there.",
      },
      {
        role: "user",
        content:
          "The output should always be in the following format: [index-number]: <first-translated-sentence> [index-number]: <second-translated-sentence> ...",
      },
      {
        role: "assistant",
        content:
          "Understood! I'm ready to translate sentences into the target language using the specified format. Just provide the details whenever you're ready.",
      },
      {
        role: "user",
        content: "Language: French 1. My name is John. 5. What's your favorite color?",
      },
    ],
    model: "gpt-3.5-turbo",
  });

  console.log(completion.choices[0].message.content);
}
main();
