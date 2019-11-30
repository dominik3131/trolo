import React, {Component} from 'react';
import axios from 'axios';
import CommentModel from "../../data-models/CommentModel";

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.withCredentials = true;

interface Props {
    cardId: number
    afterAdd: any
}

interface State {
    commentName: string
    cardNameInputOpened: boolean
}

export default class CreateComment extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            commentName: '',
            cardNameInputOpened: false,
        };
        this.toggleCommentNameInput = this.toggleCommentNameInput.bind(this);
        this.nameChanged = this.nameChanged.bind(this);
        this.createComment = this.createComment.bind(this);
    }

    createComment() {
        let comment = new CommentModel();
        comment.content = this.state.commentName;
        comment.card_id = this.props.cardId;
        this.toggleCommentNameInput();
        axios.post('/api/comments/', comment).then(
            (resp) => {
                this.props.afterAdd(resp.data)
            }
        );
    }

    toggleCommentNameInput() {
        this.setState({cardNameInputOpened: !this.state.cardNameInputOpened})
    }

    nameChanged(e: any) {
        this.setState({commentName: e.target.value});
    }

    render() {
        return [
            <input className="form-control" defaultValue={this.state.commentName}
                   onChange={this.nameChanged}/>,
            <div>
                <button type="button" className="btn btn-success btn-sm" onClick={this.createComment}>
                    <i className="fas fa-check"/>
                </button>
                <button type="button" className="btn btn-danger btn-sm" onClick={this.toggleCommentNameInput}>
                    <i className="far fa-times-circle"/>
                </button>
            </div>]
    }
}
