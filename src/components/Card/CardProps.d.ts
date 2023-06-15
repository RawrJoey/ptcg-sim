import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
import { CardInterface } from './CardInterface';

export interface CardProps {
  card: PokemonTCG.Card;
  size: CardSize;
  hoverBehavior: 'bevel' | 'float';
  entranceBehavior?: 'draw';
  clickToZoom?: boolean;
  isDragging?: boolean;
}

export type CardSize = 'sm' | 'md' | 'lg';
