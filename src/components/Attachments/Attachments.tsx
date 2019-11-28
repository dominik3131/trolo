import React, {Component} from 'react';
import axios from "axios";
import AttachmentModel from "../../data-models/AttachmentModel";
import {MDBBtn, MDBBtnGroup, MDBContainer, MDBIcon} from "mdbreact";

interface Props {
    cardId: number
    afterModify: any
}

interface State {
    attachments: AttachmentModel[]
    isLoading: boolean
}

export default class Attachments extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isLoading: true,
            attachments: []
        };
        this.bindMethods();
        this.fetchAttachments();
    }

    bindMethods() {

    }

    deleteAttachment(id: number | undefined) {
        if (id) {
            axios.delete(`/api/attachments/${id}`)
                .then(() => {
                    this.fetchAttachments();
                })
        }
    }

    fetchAttachments() {
        axios.get(`/api/cards/attachments/${this.props.cardId}`).then((resp) => {
            this.setState({attachments: resp.data, isLoading: false});
        })
    }

    renderAttachments() {
        let attachments: any[] = [];
        this.state.attachments.forEach(attachment => attachments.push(
            <MDBBtnGroup key={attachment.id} size={'sm'}>
                <a href={attachment.attached_file} download target="_blank" rel="noopener noreferrer">
                    <MDBBtn size={'sm'}>
                        {attachment.file_name}
                    </MDBBtn>
                </a>
                <MDBBtn size={'sm'} color={'danger'} onClick={() => this.deleteAttachment(attachment.id)}>
                    <MDBIcon far icon="trash-alt"/>
                </MDBBtn>
            </MDBBtnGroup>
        ));
        return <MDBContainer>{attachments}</MDBContainer>;
    }

    render() {
        return this.renderAttachments();
    }


}