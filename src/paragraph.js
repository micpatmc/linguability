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
        query = query.concat(i, ". ", sentences[i] + (i == sentences.length-1 ? "" : " "));
    return query;
}

const processModelOutput = (model_output) => {
    // Get model output sentences and their respective indices in original sentences
    const regex = /\[(\d+)\]:\s*(.+?)(?=\[\d+\]:|$)/gs;
    const matches = [...model_output.matchAll(regex)];

    const translated_sentences = matches.map((match) => ({
      index: parseInt(match[1], 10),
      sentence: match[2].trim(),
    }));

    return translated_sentences;
}

const insertTranslatedSentences = (original_sentences, translated_sentences) => {
    output_sentences = [...original_sentences];

    translated_sentences.forEach((sentence) => {
      output_sentences[sentence.index] = sentence.sentence;
    });

    return output_sentences;
}

const reconstructParagraph = (sentences) => {
  return sentences.join(" ");
};

exports.splitParagraph = splitParagraph;
exports.prepareQuery = prepareQuery;
exports.processModelOutput = processModelOutput;
exports.insertTranslatedSentences = insertTranslatedSentences;
exports.reconstructParagraph = reconstructParagraph;