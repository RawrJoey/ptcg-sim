import { CardInterface } from "@/components/Card/CardInterface";
import { HGSS_ENERGY_MAP } from "./consts";

export const parseDeckList = (rawList: string, codeToSetMap: Record<string, string> | undefined): CardInterface[] => {
  const lines = rawList.trim().split(/\r?\n/).filter(line => line.length > 0);

  const deck: CardInterface[] = [];

  for (const line of lines) {
    const [count, ...rest] = line.split(' ');

    let cardName, setNum, setCode;

    // Energy check
    const energyThatMatchesName: keyof typeof HGSS_ENERGY_MAP | undefined = (Object.keys(HGSS_ENERGY_MAP) as Array<keyof typeof HGSS_ENERGY_MAP>).find((name) => rest.join(' ').includes(name));
    if (energyThatMatchesName) {
      cardName = energyThatMatchesName;
      const { number, set } = HGSS_ENERGY_MAP[energyThatMatchesName];
      setNum = number;
      setCode = set;
    } else {
      setNum = rest[rest.length - 1];
      setCode = rest[rest.length - 2];
      cardName = rest.slice(0, rest.length - 2).join(' ');
  
      console.log(cardName, setNum, setCode)

    }
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