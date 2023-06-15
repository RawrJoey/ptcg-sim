import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
import { CardInterface, CardObject } from './CardInterface';

export interface CardProps {
  card: CardObject;
  size: CardSize;
  hoverBehavior: 'bevel' | 'float';
  entranceBehavior?: 'draw';
  clickToZoom?: boolean;
  isDragging?: boolean;
}

export type CardSize = 'sm' | 'md' | 'lg';
