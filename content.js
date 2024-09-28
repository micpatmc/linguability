// Minimum amount of characters to be considered a paragraph
const LETTER_MINIMUM = 200;

// Function to translate the paragraph
const translateParagraph = async (paragraphObj) => {
  // Pre-process paragraph
  const sentences = splitParagraph(paragraphObj);

  const apiKey = "Place API key here";

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
    console.log(data);
    const translatedSentence = data.choices[0].message.content;
    model_output.push(`<span style="color: red;">${translatedSentence}</span>`);
  }

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
        element.innerHTML = translatedText;
      } catch (error) {
        console.error("Translation failed:", error);
      }
    }
  }
}

// Function to split a paragraph into a list of sentences
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

// Function to take a list of sentences and convert it into a paragraph
const reconstructParagraph = (sentences) => {
  return sentences.join(" ");
};

// Run the replacement on <p> elements
replaceElementsText("p");
