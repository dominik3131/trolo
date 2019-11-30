import CommentModel from "./CommentModel";

export default class CardModel {
    id: number | undefined;
    name: string | undefined;
    comments: CommentModel[] | undefined;
    description: string | undefined;
    id_list: number | undefined;
    is_archive: boolean | undefined;
}