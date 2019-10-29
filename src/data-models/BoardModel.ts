import ListModel from "./ListModel";
import UserModel from "./UserModel";
import TeamModel from "./TeamModel";

export default class BoardModel {
    id: number = 0;
    name: string = 'name';
    owner: UserModel = {};
    isPrivate: boolean = true;
    isStared: boolean = true;
    seenInLastTime = true;
    lists: ListModel[] = [];
    backgroundUrl: string = 'https://image.shutterstock.com/image-photo/colorful-flower-on-dark-tropical-260nw-721703848.jpg';
    addedUsers: UserModel[] = [];
    team: TeamModel[] = [];
}