import { CardInterface } from "@/components/Card/CardInterface";

export const parseDeckList = (rawList: string, codeToSetMap: Record<string, string> | undefined): CardInterface[] => {
  const lines = rawList.trim().split(/\r?\n/).filter(line => line.length > 0);

  const deck: CardInterface[] = [];

  for (const line of lines) {
    const [count, ...rest] = line.split(' ');
    const setNum = rest[rest.length - 1];
    const setCode = rest[rest.length - 2];
    const cardName: string = rest.slice(0, rest.length - 2).join(' ');
    const imageUrl = getCardImageUrl({ number: setNum, set: setCode }, codeToSetMap, { highRes: true });

    for (let countIdx = 0; countIdx < parseInt(count); countIdx++) {
      deck.push({ name: cardName, id: Math.random(), imageUrl })
    }
  }

  return deck;
}

export const getCardImageUrl = (
  card: {
    number: string;
    set: string;
  },
  codeToSetMap: Record<string, string> | undefined,
  options?: { highRes: boolean }
) => {
  let set = codeToSetMap?.[card.set];
  if (!set) {
    return '';
  }

  if (card.number.includes('SWSH')) {
    set = 'swshp';
  } else if (card.number.includes('SV')) {
    set = set.replace('sv', '').concat('sv');
  }

  if (card.number.includes('GG')) {
    set = set.replace('gg', '').concat('gg');
  } else {
    set = set.replace('gg', '');
  }

  if (card.number.includes('TG')) {
    set = set.replace('tg', '').concat('tg');
  } else {
    set = set.replace('tg', '');
  }
  
  if (set[set.length - 1] === 'c') {
    set = set.slice(0, set.length - 1);
  }

  return `https://images.pokemontcg.io/${set}/${card?.number}${
    options?.highRes ? '_hires' : ''
  }.png`;
};