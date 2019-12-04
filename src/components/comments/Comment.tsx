import React, {Component} from 'react';
import CommentModel from "../../data-models/CommentModel";
import axios from "axios";
import SmallSpinner from "../../utils/SmallSpinner";
import {
    MDBBtn, MDBCard, MDBCardBody, MDBFormInline,
    MDBIcon, MDBInput
} from "mdbreact";

interface Props {
    comment: CommentModel
    afterModify: any
}

interface State {
    isLoading: boolean
    comment: CommentModel
    toggleCommentContentOpen: boolean
    toggleOpenDeleteComment: boolean
    newComment: string
}

export default class Comment extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isLoading: true,
            comment: this.props.comment,
            toggleCommentContentOpen: false,
            toggleOpenDeleteComment: false,
            newComment: '',
        };
        this.bindMethods();
        this.fetchComment();
    }

    bindMethods() {
        this.commentContentChanged = this.commentContentChanged.bind(this);

        this.toggleNameComment = this.toggleNameComment.bind(this);
        this.toggleDeleteComment = this.toggleDeleteComment.bind(this);

        this.updateCommentName = this.updateCommentName.bind(this);
        this.updateDeleteComment = this.updateDeleteComment.bind(this);
    }

    updateCommentName() {
        let comment = this.state.comment;
        comment.content = this.state.newComment;
        this.updateComment(comment);
        this.toggleNameComment();
    }

    toggleNameComment() {
        this.setState({
            toggleCommentContentOpen: !this.state.toggleCommentContentOpen,
            newComment: this.state.comment.content as string
        })
    }

    toggleDeleteComment() {
        this.setState({toggleOpenDeleteComment: !this.state.toggleOpenDeleteComment})
    }

    fetchComment() {
        axios.get(`/api/comments/${this.props.comment.id}`)
            .then((resp) => {
                this.setState({comment: resp.data, isLoading: false});
            });
    }

    updateComment(comment: CommentModel) {
        this.setState({comment: comment});
        axios.put(`/api/comments/${this.state.comment.id}`, comment)
            .then((resp) => {
                this.setState({comment: resp.data});
                this.props.afterModify();
            });
    };

    deleteComment() {
        axios.delete(`/api/comments/${this.state.comment.id}`)
            .then(() => {
                this.props.afterModify();
            });
    };

    updateDeleteComment() {
        this.deleteComment();
        this.toggleDeleteComment();
    }

    commentContentChanged(e: any) {
        this.setState({newComment: e.target.value})
    }

    commentDescription() {
        if (this.state.toggleCommentContentOpen) {
            return [
                <MDBInput
                    type="textarea"
                    rows="2"
                    label="Write comment"
                    value={this.state.newComment || ''}
                    onChange={this.commentContentChanged}
                    key={'input'}
                />,
                <MDBBtn key={'accept'} color={'primary'} size={'sm'} onClick={this.updateCommentName}>
                    <MDBIcon icon={'fas fa-check'}/>
                </MDBBtn>,
                <MDBBtn key={'cancel'} color={'danger'} size={'sm'} onClick={this.toggleNameComment}>
                    <MDBIcon icon={'far fa-times-circle'}/>
                </MDBBtn>
            ]
        } else {
            return [
                this.commentContent(),
                <MDBBtn key={'button'} color={'success'} size={'sm'} onClick={this.toggleNameComment}>
                    Edit
                </MDBBtn>
            ]
        }
    }

    commentDelete() {
        if (this.state.toggleOpenDeleteComment) {
            return <MDBFormInline>
                <MDBBtn color={'default'} size={'sm'}>
                    Delete comment?
                </MDBBtn>
                <MDBBtn color={'success'} size={'sm'} onClick={this.updateDeleteComment}>
                    <MDBIcon icon={'fas fa-check'}/>
                </MDBBtn>
                <MDBBtn color={'danger'} size={'sm'} onClick={this.toggleDeleteComment}>
                    <MDBIcon icon={'far fa-times-circle'}/>
                </MDBBtn>
            </MDBFormInline>

        } else {
            return <MDBBtn key={'button'} color={'danger'} size={'sm'} onClick={this.toggleDeleteComment}>
                Delete
            </MDBBtn>

        }
    }

    commentContent() {
        let regex = /\[.*]\(.*\)/gm;
        let content = this.state.comment.content;
        if (content) {
            let attachment = content.match(regex);
            if (attachment) {
                let name = attachment[0].substring(1, attachment[0].indexOf(']'));
                let url = attachment[0].substring(attachment[0].indexOf('(') + 1, attachment[0].indexOf(')'));
                content = content.replace(attachment[0], '');
                return <div key={url}>
                    {content}
                    <br/>
                    <a href={url}>
                        {name}
                    </a>
                </div>;
            }
        }
        return null;
    }

    view() {
        if (this.state.isLoading) {
            return <MDBCard>
                <MDBCardBody>
                    <SmallSpinner/>
                </MDBCardBody>
            </MDBCard>
        }
        return <MDBCard>
            <MDBCardBody className={"text-left"}>
                {this.commentDescription()}
                {this.commentDelete()}
            </MDBCardBody>
        </MDBCard>
    }

    render() {
        return this.view();
    }
}