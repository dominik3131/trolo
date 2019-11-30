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
}

export default class Comment extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isLoading: true,
            comment: this.props.comment,
        };
        this.bindMethods();
        this.fetchComment();
    }
    bindMethods() {
        
    }

    fetchComment() {
        axios.get(`/api/comments/${this.props.comment.id}`)
            .then((resp) => {
                this.setState({comment: resp.data, isLoading: false});
            });
    }
}