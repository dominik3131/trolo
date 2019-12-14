import CommentModel from "./CommentModel";
import ActivityModel from "./ActivityModel";

export default class CardModel {
    id: number | undefined;
    name: string | undefined;
    comments: CommentModel[] | undefined;
    description: string | undefined;
    id_list: number | undefined;
    is_archive: boolean | undefined;
    activities: ActivityModel[] | undefined;
}