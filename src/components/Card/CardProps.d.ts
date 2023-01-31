export interface CardProps {
  size: 'sm' | 'md';
  hoverBehavior: 'bevel' | 'float';
  entranceBehavior?: 'draw';
  clickToZoom?: boolean;
}