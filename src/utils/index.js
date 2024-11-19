export function addToLocal(word) {
  const wordss = JSON.parse(localStorage.getItem("usedWords")) || [];
  wordss.push(word);
  localStorage.setItem("usedWords", JSON.stringify(wordss));
}
export function getLocalUsedWords() {
  return JSON.parse(localStorage.getItem("usedWords")) || [];
}
export function filterWords(words) {
  const usdwrds = getLocalUsedWords();
  return words.filter((word) => !usdwrds.includes(word));
}
