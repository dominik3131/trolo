import React, {Component} from 'react';
import CommentModel from "../../data-models/CommentModel";
import axios from "axios";
import SmallSpinner from "../../utils/SmallSpinner";
import {
    MDBBtn, MDBCard, MDBCardBody,
    MDBCol,
    MDBContainer, MDBFormInline,
    MDBIcon, MDBInput,
    MDBModal,
    MDBModalBody,
    MDBModalFooter,
    MDBModalHeader,
    MDBRow
} from "mdbreact";
import Attachments from "../Attachments/Attachments";

interface Props {
    comment: CommentModel
    afterModify: any
}

interface State {
    isLoading: boolean
    comment: CommentModel
    toogleCommentContentOpen: boolean
    toogleOpenDeleteComment: boolean
    newComment: string
}

export default class Comment extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isLoading: true,
            comment: this.props.comment,
            toogleCommentContentOpen: false,
            toogleOpenDeleteComment: false,
            newComment: '',
        };
        this.bindMethods();
        this.fetchComment();
    }
    bindMethods() {
        this.contentChangeComment = this.contentChangeComment.bind(this);

        this.toggleNameComment = this.toggleNameComment.bind(this);
        this.toggleDeleteComment = this.toggleDeleteComment.bind(this);

        this.updateCommentName = this.updateCommentName.bind(this);
        this.updateDeleteComment = this.updateDeleteComment.bind(this);
    }

    updateCommentName() {
        let comment = this.state.comment;
        comment.content = this.state.newComment;
        this.updateComment(comment);
        //this.setState({comment: comment});
        this.toggleNameComment();
    }

    toggleNameComment() {
        this.setState({toogleCommentContentOpen: !this.state.toogleCommentContentOpen})
    }

    toggleDeleteComment() {
        this.setState({toogleOpenDeleteComment: !this.state.toogleOpenDeleteComment})
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

    contentChangeComment(e: any) {
        this.setState({newComment: e.target.value})
    }

    commentDescription() {
        if (this.state.toogleCommentContentOpen) {
            return [
                <input className="form-control" defaultValue={this.state.comment.content || ''}
                       onChange={this.contentChangeComment}/>,
                <MDBBtn color={'primary'} size={'sm'} onClick={this.updateCommentName}>
                    <MDBIcon icon={'fas fa-check'}/>
                </MDBBtn>,
                <MDBBtn color={'danger'} size={'sm'} onClick={this.toggleNameComment}>
                    <MDBIcon icon={'far fa-times-circle'}/>
                </MDBBtn>
            ]
        } else {
            return [
                <MDBBtn key={'button'} color={'success'} size={'sm'} onClick={this.toggleNameComment}>
                    Edit
                </MDBBtn>
            ]
        }
    }

    commentDelete() {
        if (this.state.toogleOpenDeleteComment) {
            return [
                <MDBBtn color={'default'} size={'sm'} >
                    Delete comment?
                </MDBBtn>,
                <MDBBtn color={'success'} size={'sm'} onClick={this.updateDeleteComment}>
                    <MDBIcon icon={'fas fa-check'}/>
                </MDBBtn>,
                <MDBBtn color={'danger'} size={'sm'} onClick={this.toggleDeleteComment}>
                    <MDBIcon icon={'far fa-times-circle'}/>
                </MDBBtn>
            ]

        } else {
            return [
                <MDBBtn key={'button'} color={'danger'} size={'sm'} onClick={this.toggleDeleteComment}>
                    Delete
                </MDBBtn>
            ]        }
    }

    view() {
        if (this.state.isLoading) {
            return<MDBCard>
                <MDBCardBody>
                    <SmallSpinner/>
                </MDBCardBody>
            </MDBCard>
        }
        return <MDBCard>
            <MDBCardBody>
                
                <MDBRow>
                <div className="text-left">
                    {this.state.comment.content}
                </div>
                </MDBRow>
                <MDBRow>
                <div className="text-right">
                    {this.commentDescription()}
                    {this.commentDelete()}
                </div>
                </MDBRow>
            </MDBCardBody>
        </MDBCard>
    }

    render() {
        return <div>
            {this.view()}
        </div>;
    }
}