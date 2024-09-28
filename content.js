// Function to replace text in text nodes only
function replaceText(node, newText) {
  if (node.nodeType === Node.TEXT_NODE) {
    if (node.nodeValue.trim() !== '') {
      node.nodeValue = newText;
    }
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    if (node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') {
      node.childNodes.forEach(child => replaceText(child, newText));
    }
  }
}

// New word to replace existing text with
const newText = "New Word";
replaceText(document.body, newText);
