import ListModel from "./ListModel";

export default class TableModel {
    id: number = 0;
    name: string = 'name';
    visibility: number = 0;
    favorite: boolean = true;
    last_open: number  = Date.now();
    last_modyfied: number  = Date.now();
    lists: ListModel[] = [];
    background: string = 'https://image.shutterstock.com/image-photo/colorful-flower-on-dark-tropical-260nw-721703848.jpg';
    id_team: number = 0;
}