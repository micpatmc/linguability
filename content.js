// Minimum amount of characters to be considered a paragraph
const LETTER_MINIMUM = 200;

// Parameters
let selectedLanguage = null;
let selectedExperience = null;

// Function to translate the paragraph
const translateParagraph = async (paragraphObj) => {
  // Pre-process paragraph
  const sentences = splitParagraph(paragraphObj);

  const apiKey =
    "Your API Key";

  let model_output = [];

  // Variable to not allow consecutive sentence translations
  let pickedLast = false;
  for (const sentence of sentences) {
    const chanceToTranslate = Math.floor(Math.random() * 7);
    const difficulty = paragraphObj.difficulty;

    if (pickedLast || difficulty === "beginner") {
      if (chanceToTranslate < 6) {
        model_output.push(sentence);
        pickedLast = false;
        continue;
      }
    } else if (pickedLast || difficulty === "intermediate") {
      if (chanceToTranslate < 4) {
        model_output.push(sentence);
        pickedLast = false;
        continue;
      }
    } else if (pickedLast || difficulty === "advanced") {
      if (chanceToTranslate < 2) {
        model_output.push(sentence);
        pickedLast = false;
        continue;
      }
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
            content: `Rewrite the following sentence in ${paragraphObj.language}: ${sentence}`,
          },
        ],
      }),
    });

    const data = await response.json();
    const translatedSentence = data.choices[0].message.content;
    model_output.push(`
      <p class = "translationBlock">
        <span style="color: red;">${translatedSentence}</span>
        <span style="color: blue; display: none;">${sentence}</span>
      </p>
      `);

    pickedLast = true;
  }
  
  const output_paragraph = reconstructParagraph(model_output);
  return output_paragraph;
};

// Function to replace the text content of specific elements asynchronously
async function replaceElementsText(selector) {
  const elements = document.querySelectorAll(selector);
  for (const element of elements) {
    if (element.textContent.length >= LETTER_MINIMUM) {
      const paragraphObj = { textContent: element.textContent, language: selectedLanguage, difficulty: selectedExperience };
      try {
        const translatedText = await translateParagraph(paragraphObj);
        element.innerHTML = translatedText;
        
        // Add event listener to each translation block
        const translationBlocks = document.getElementsByClassName("translationBlock");
        for (const transBlock of translationBlocks) {
          transBlock.addEventListener("mouseover", function () {
            transBlock.children[0].style.display = "none";
            transBlock.children[1].style.display = "inline";
          });
          transBlock.addEventListener("mouseout", function () {
            transBlock.children[0].style.display = "inline";
            transBlock.children[1].style.display = "none";
          });
        } 
      } catch (error) {
        console.error("Translation failed:", error);
      }
    }
  }

  const translationBlocks = document.getElementsByClassName("translationBlock");
  for (const transBlock of translationBlocks) {
    transBlock.addEventListener("mouseover", function () {
      transBlock.children[0].style.display = "none";
      transBlock.children[1].style.display = "inline";
    });
    transBlock.addEventListener("mouseout", function () {
      transBlock.children[0].style.display = "inline";
      transBlock.children[1].style.display = "none";
    });
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

// Listener to receive information from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received from popup script:", message);

  selectedLanguage = message.language;
  selectedExperience = message.difficulty;
  
  replaceElementsText('p');
  sendResponse({ status: "Message received", data: message });
});
