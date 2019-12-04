import React, {Component} from 'react';
import axios from 'axios';
import CommentModel from "../../data-models/CommentModel";
import {MDBBtn, MDBFormInline, MDBIcon, MDBInput} from "mdbreact";
import AttachmentInput from "../Attachments/AttachmentInput";
import AttachmentModel from "../../data-models/AttachmentModel";

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.withCredentials = true;

interface Props {
    cardId: number
    afterAdd: any
}

interface State {
    commentText: string
}

export default class CreateComment extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            commentText: '',
        };
        this.commentChanged = this.commentChanged.bind(this);
        this.createComment = this.createComment.bind(this);
        this.attachmentAdded=this.attachmentAdded.bind(this);
    }

    createComment() {
        if (this.state.commentText.length) {
            let comment = new CommentModel();
            comment.content = this.state.commentText;
            comment.card_id = this.props.cardId;
            axios.post('/api/comments/', comment).then(
                () => {
                    this.props.afterAdd()
                }
            );
            this.setState({commentText: ''});
        }
    }

    commentChanged(e: any) {
        this.setState({commentText: e.target.value});
    }

    attachmentAdded(attachment:AttachmentModel){
        let comment = this.state.commentText;
        comment = comment+'['+attachment.file_name+']('+attachment.attached_file+') ';
        this.setState({commentText:comment});
    }
    render() {
        return <div>
            <MDBInput
                type="textarea"
                rows="2"
                label="Write comment"
                value={this.state.commentText}
                onChange={this.commentChanged}
            />
            <MDBFormInline>
                <MDBBtn color={'success'} size={"sm"} onClick={this.createComment}>
                    <MDBIcon icon="check"/>
                </MDBBtn>
                <AttachmentInput cardId={this.props.cardId} afterAdd={this.attachmentAdded} size={'sm'}/>
            </MDBFormInline>
        </div>

    }
}
