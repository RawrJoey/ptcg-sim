import { CardInterface } from './CardInterface';

export interface DraggableCardProps extends CardProps {
  handleMoveCard: (
    card: CardInterface,
    source: Area,
    destination: Area
  ) => void;
}

export interface CardProps {
  card: CardInterface;
  size: CardSize;
  hoverBehavior: 'bevel' | 'float';
  entranceBehavior?: 'draw';
  clickToZoom?: boolean;
  isDragging?: boolean;
}

export type CardSize = 'sm' | 'md' | 'lg';
