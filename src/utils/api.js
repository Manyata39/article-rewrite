export const fetchSynonyms = async (word) => {
  try {
    const response = await fetch(
      `https://api.datamuse.com/words?rel_syn=${word}&max=5`
    );
    const data = await response.json();
    return data.map((item) => item.word);
  } catch (err) {
    console.error("Synonym error:", err);
    return [];
  }
};