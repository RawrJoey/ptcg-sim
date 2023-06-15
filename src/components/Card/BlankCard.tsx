import { v4 as uuidv4 } from 'uuid';
import { Card } from './Card';
import { CardObject } from './CardInterface';

export const BlankCard = () => {
  const card = { images: { small: 'https://images.pokemontcg.io/0.png', large: 'https://images.pokemontcg.io/0.png' }, uuid: uuidv4() } as unknown as CardObject;
  return <Card size='sm' card={card} hoverBehavior='float' />
};
