export interface Card {
  id: number;
  name: string;
  text: string;
  flavorText: string;
  image: string;
}

export interface CardList {
  cards: Card[];
}
