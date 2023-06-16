import { v4 as uuidv4 } from 'uuid';
import { Card } from './Card';
import { CardObject } from './CardInterface';

export const BLANK_CARD_IMAGE_URL = 'https://images.pokemontcg.io/0.png';

export const BlankCard = () => {
  const card = { images: { small: BLANK_CARD_IMAGE_URL, large: BLANK_CARD_IMAGE_URL }, uuid: uuidv4() } as unknown as CardObject;
  return <Card size='md' card={card} hoverBehavior='float' />
};
