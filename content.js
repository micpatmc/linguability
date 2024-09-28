const LETTER_MINIMUM = 200;

// Function to translate the paragraph
const translateParagraph = async (paragraphObj) => {
  // Pre-process paragraph
  const sentences = splitParagraph(paragraphObj);
  const query = prepareQuery(sentences, "N/A");

  // Call OpenAI API using fetch (no need for linguist.js)
  const apiKey = "Place API key here.";

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`, // Set your API key in the Authorization header
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an expert linguistic teacher. Your task is to help others learn languages by changing sentences in text into a target language.",
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
          content: `Language: Spanish ${query}`, // Adjust target language and query dynamically
        }
      ]
    }),
  });

  const data = await response.json();
  const model_output = data.choices[0].message.content;

  // Process model output
  const translated_sentences = processModelOutput(model_output);
  console.log(translated_sentences);

  const output_sentences = insertTranslatedSentences(sentences, translated_sentences);
  const output_paragraph = reconstructParagraph(output_sentences);

  return output_paragraph;
};

// Function to replace the text content of specific elements asynchronously
async function replaceElementsText(selector) {
  const elements = document.querySelectorAll(selector);

  for (const element of elements) {
    if (element.textContent.length >= LETTER_MINIMUM) {
      const paragraphObj = { textContent: element.textContent };
      try {
        const translatedText = await translateParagraph(paragraphObj);
        element.textContent = translatedText;
      } catch (error) {
        console.error("Translation failed:", error);
      }
    }
  }
}

function splitParagraph(paragraphObj) {
  return paragraphObj.textContent.split(/([.!?])\s*/g).reduce((acc, part) => {
    if ([".", "!", "?"].includes(part)) {
      acc[acc.length - 1] += part;
    } else if (part.trim()) {
      acc.push(part);
    }
    return acc;
  }, []);
}

const prepareQuery = (sentences, difficulty) => {
  query = "";
  for (let i = 0; i < sentences.length; i++)
    query = query.concat(i, ". ", sentences[i] + (i == sentences.length - 1 ? "" : " "));
  return query;
};

const processModelOutput = (model_output) => {
  // Get model output sentences and their respective indices in original sentences
  const regex = /\[(\d+)\]:\s*(.+?)(?=\[\d+\]:|$)/gs;
  const matches = [...model_output.matchAll(regex)];

  const translated_sentences = matches.map((match) => ({
    index: parseInt(match[1], 10),
    sentence: match[2].trim(),
  }));

  return translated_sentences;
};

const insertTranslatedSentences = (original_sentences, translated_sentences) => {
  output_sentences = [...original_sentences];

  translated_sentences.forEach((sentence) => {
    output_sentences[sentence.index] = sentence.sentence;
  });

  return output_sentences;
};

const reconstructParagraph = (sentences) => {
  return sentences.join(" ");
};

// Run the replacement on <p> elements
replaceElementsText("p");
