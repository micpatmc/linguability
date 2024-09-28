const paragraph = require("./src/paragraph")

const translateParagraph = (paragraphObj) => {
  // Pre-process paragraph
  const sentences = paragraph.splitParagraph(paragraphObj);
  const query = paragraph.prepareQuery(sentences, "N/A");

  // Run model (WIP)

  // Process model output
  translated_sentences = paragraph.processModelOutput(model_output);
  output_sentences = paragraph.insertTranslatedSentences(sentences, translated_sentences);
  output_paragraph = paragraph.reconstructParagraph(output_sentences);

  return output_paragraph;
}