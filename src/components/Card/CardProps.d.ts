export interface CardProps {
  size: CardSize;
  hoverBehavior: 'bevel' | 'float';
  entranceBehavior?: 'draw';
  clickToZoom?: boolean;
}

export type CardSize = 'sm' | 'md' | 'lg';
