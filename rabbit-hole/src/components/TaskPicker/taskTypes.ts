export const ranks = [
  { letter: "J", name: "Jack", difficulty: "Easy", minutes: 10 },
  { letter: "Q", name: "Queen", difficulty: "Medium", minutes: 20 },
  { letter: "K", name: "King", difficulty: "Hard", minutes: 30 },
] as const;

export type Rank = (typeof ranks)[number]["letter"];
