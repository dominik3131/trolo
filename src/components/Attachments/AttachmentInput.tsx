import React, {Component} from 'react';
import axios from "axios";
import './AttachmentInput.css';
import {MDBIcon} from "mdbreact";

interface Props {
    cardId: any
    afterAdd: any
    size?: 'sm' | 'lg'
}

interface State {
}

export default class AttachmentInput extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {};
        this.bindMethods();
    }

    bindMethods() {
    }

    attachFileToCard(file: File) {
        const data = new FormData();
        let id = this.props.cardId;
        let stringId = id.toString();
        data.append('attached_file', file);
        data.append('card_id', stringId);
        data.append('file_name', file.name);
        axios.post(`/api/attachments/`, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then((resp) => {
                this.props.afterAdd(resp.data);
            });
    }

    handleFileChange(selectorFiles: FileList | null) {
        if (selectorFiles) {
            let file = selectorFiles.item(0);
            if (file) {
                this.attachFileToCard(file);
            }
        }
    }

    attachmentInput() {
        if (this.props.size === 'sm')
            return <div className="custom-file sm">
                <input
                    type="file"
                    className="custom-file-input sm form-control-file"
                    id="inputGroupFile01"
                    onChange={(e) => this.handleFileChange(e.target.files)}
                    aria-describedby="inputGroupFileAddon01"
                />
                <label className="custom-file-label sm-label" htmlFor="inputGroupFile01">
                    <MDBIcon icon="paperclip" />
                </label>
            </div>;
        return <div className="custom-file">
            <input
                type="file"
                className="custom-file-input"
                id="inputGroupFile01"
                onChange={(e) => this.handleFileChange(e.target.files)}
                aria-describedby="inputGroupFileAddon01"
            />
            <label className="custom-file-label" htmlFor="inputGroupFile01">
                <MDBIcon icon="paperclip" /> Attach file
            </label>
        </div>
    }

    render() {
        return this.attachmentInput();
    }
}