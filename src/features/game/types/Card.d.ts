export interface MoveCardPayload {
  // The card being moved
  card: CardObject,
  // The zone of origin
  origin: CardZone,
  // The destination zone
  destination: CardZone,
}