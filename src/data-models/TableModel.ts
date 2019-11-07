import ListModel from "./ListModel";

export default class TableModel {
    id: number | undefined;
    name: string | undefined ;
    visibility: number | undefined;
    favourite: boolean | undefined;
    last_open: Date  = new Date(Date.now());
    last_modyfied: Date  = new Date(Date.now());
    lists: ListModel[] | undefined;
    background: string = 'https://image.shutterstock.com/image-photo/colorful-flower-on-dark-tropical-260nw-721703848.jpg';
    id_team: number | undefined;
}