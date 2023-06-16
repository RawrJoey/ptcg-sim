import { CardObject } from '@/components/Card/CardInterface';
import { CardZone } from '@/components/Card/DraggableCard';

export interface MoveCardPayload {
  // The card being moved
  card: CardObject,
  // The zone of origin
  origin: CardZone,
  // The destination zone
  destination: CardZone,
}

export interface GameplayAction<T> {
  type: string;
  payload?: T;
}