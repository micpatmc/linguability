const LETTER_MINIMUM = 200;

// Function to translate the paragraph
const translateParagraph = async (paragraphObj) => {
  // Pre-process paragraph
  const sentences = splitParagraph(paragraphObj);
  //const query = prepareQuery(sentences, "N/A");
  //console.log(query);

  const apiKey = "Your api key here";

  let model_output = [];
  for (const sentence of sentences) {
    const chanceToTranslate = Math.random() * 3;

    if (chanceToTranslate < 2) {
      model_output.push(sentence);
      continue;
    }
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
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
            content: `Rewrite the following sentence in Spanish: ${sentence}`,
          },
        ],
      }),
    });

    const data = await response.json();
    model_output.push(data.choices[0].message.content);
  }
  // Process model output
  // const translated_sentences = processModelOutput(model_output);
  // console.log(translated_sentences);

  // const output_sentences = insertTranslatedSentences(sentences, translated_sentences);
  const output_paragraph = reconstructParagraph(model_output);

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
