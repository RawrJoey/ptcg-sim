export interface CardProps {
  size: CardSize;
  hoverBehavior: 'bevel' | 'float';
  entranceBehavior?: 'draw';
  clickToZoom?: boolean;
  isDragging?: boolean
}

export type CardSize = 'sm' | 'md' | 'lg';
