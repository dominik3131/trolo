import CardModel from "./CardModel";

export default class ListModel{
    id: number | undefined;
    name: string | undefined;
    id_table: number | undefined;
    cards: CardModel[] | undefined;
}