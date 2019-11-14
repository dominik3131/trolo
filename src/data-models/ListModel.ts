import CardModel from "./CardModel";

export default class ListModel{
    id: number | undefined;
    name: string | undefined;
    cards: CardModel[] | undefined;
}