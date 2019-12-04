import React, {Component} from 'react';
import CommentModel from "../../data-models/CommentModel";
import axios from "axios";
import SmallSpinner from "../../utils/SmallSpinner";
import Comment from "./Comment";
import CreateComment from "./CreateComment";

interface Props {
    cardId: any
    afterModify: any
}

interface State {
    isLoading: boolean
    comments: CommentModel[]
}

export default class CommentsList extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isLoading: true,
            comments: []
        };
        this.bindMethods();
        this.fetchComments();
    }

    bindMethods() {
    }

    fetchComments() {
        axios.get(`/api/cards/comments/${this.props.cardId}`)
            .then((resp) => {
                this.setState({comments: resp.data, isLoading: false});
            });
    }

    commentChanged() {
        this.props.afterModify();
        this.fetchComments();
    }

    renderComments() {
        const items: any[] = [];
        if (this.state.comments) {
            this.state.comments
                .forEach(comment => {
                        items.push(<Comment afterModify={this.commentChanged.bind(this)} key={comment.id}
                                            comment={comment}/>);
                    }
                )
        }
        return items
    }

    render() {
        if (this.state.isLoading)
            return <SmallSpinner/>;
        else return <div>
            <CreateComment cardId={this.props.cardId} afterAdd={this.commentChanged.bind(this)}/>
            Comments
            {this.renderComments()}
        </div>;
    }
}