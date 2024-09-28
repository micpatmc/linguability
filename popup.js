const paragraph = require("./src/paragraph");
const linguist = require("./src/linguist");

const translateParagraph = async (paragraphObj) => {
  // Pre-process paragraph
  const sentences = paragraph.splitParagraph(paragraphObj);
  const query = paragraph.prepareQuery(sentences, "N/A");

  // Run model (WIP)
  const model_output = await linguist.getCompletion("Spanish", query);

  // Process model output
  translated_sentences = paragraph.processModelOutput(model_output);
  output_sentences = paragraph.insertTranslatedSentences(sentences, translated_sentences);
  output_paragraph = paragraph.reconstructParagraph(output_sentences);

  console.log(output_paragraph);
  return output_paragraph;
};

translateParagraph({
  textContent:
    "Sometimes, I try to make desserts at home. Normally, I search for recipes on the internet. But I always do something wrong. I almost always forget an ingredient. And sometimes, I put the cake in the oven, I go watch TV and I forget about everything. Two hours later I have a black dessert on the kitchen table.",
});
