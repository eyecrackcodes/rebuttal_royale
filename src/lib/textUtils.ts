export const cleanTextForSpeech = (text: string | string[]): string => {
  if (Array.isArray(text)) {
    text = text[Math.floor(Math.random() * text.length)];
  }
  return text
    .replace(/\[.*?\]/g, '')
    .replace(/\.\.\./g, ',')
    .replace(/[^\w\s,.?!'-@]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}; 