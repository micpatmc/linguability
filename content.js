const LETTER_MINIMUM = 20;

// Function to replace the text content of specific elements
function replaceElementsText(selector, newText) {
  // Select all elements matching the selector
  const elements = document.querySelectorAll(selector);

  elements.forEach((element) => {
    // Replace the entire text content of the element
    if (element.textContent.length >= LETTER_MINIMUM) {
      let tmp = "";

      for (let i = element.textContent.length; i >= 0; i--)
        tmp += element.textContent[i];

      element.textContent = tmp;
    }
  });
}

// New word or phrase to replace existing text with
const newText = "Your New Phrase Here";
replaceElementsText("p", newText);
