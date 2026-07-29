const ADJECTIVES = [
  "Gentle",
  "Brave",
  "Kind",
  "Calm",
  "Warm",
  "Quiet",
  "Steady",
  "Hopeful",
  "Caring",
  "Peaceful",
];

const NOUNS = [
  "Soul",
  "Heart",
  "Spirit",
  "Star",
  "Light",
  "Wave",
  "Breeze",
  "River",
  "Cloud",
  "Phoenix",
];

export function generateAnonymousName(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(Math.random() * 900) + 100;
  return `${adj}${noun}${num}`;
}
