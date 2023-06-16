import { CardModalView, SpecificCardModalViewProps } from "../Generic/CardModalView";

export const DeckView = (props: SpecificCardModalViewProps) => <CardModalView {...props} cardOrigin={{ area: 'deck' }} />