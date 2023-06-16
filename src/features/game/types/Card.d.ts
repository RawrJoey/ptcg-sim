export interface MoveCardPayload {
  // The card being moved
  card: CardObject,
  // The zone of origin
  origin: CardZone,
  // The destination zone
  destination: CardZone,
  // Function that displays a toast on card move completion
  toast: (message: string) => {}
}